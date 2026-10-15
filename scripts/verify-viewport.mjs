import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

function findChromeBinary() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }

  const candidatePaths = [
    "/home/rizalkurnia/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell",
    "/home/rizalkurnia/.cache/puppeteer/chrome-headless-shell/linux-145.0.7632.46/chrome-headless-shell-linux64/chrome-headless-shell",
    "/home/rizalkurnia/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome",
    "/home/rizalkurnia/.cache/puppeteer/chrome/linux-145.0.7632.46/chrome-linux64/chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error("No Chromium or Chrome binary found for headless inspection.");
}

const CHROME_BIN = findChromeBinary();
const PORT = 3456;
const CDP_PORT = 9333;
const USER_DATA_DIR = path.resolve(".chrome-user-data");
const TARGET_URL = `http://127.0.0.1:${PORT}/demo/demo-generik`;
const SCREENSHOT_PATH = path.resolve("public/viewport-360-inspection.png");

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, getLogs, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        return;
      }
    } catch {
      // Server not ready yet
    }
    await wait(250);
  }
  const logs = getLogs ? getLogs() : "";
  throw new Error(`Server failed to respond at ${url} within ${timeoutMs}ms. Server logs:\n${logs}`);
}

async function waitForCdp(port, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.status === 200) {
        return await res.json();
      }
    } catch {
      // CDP not ready yet
    }
    await wait(250);
  }
  throw new Error(`CDP failed to respond at port ${port} within ${timeoutMs}ms`);
}

async function main() {
  console.log("Starting Next.js production server on port", PORT);
  let nextLogs = "";
  const nextServer = spawn(
    "node",
    ["./node_modules/next/dist/bin/next", "start", "-p", String(PORT), "-H", "127.0.0.1"],
    {
      stdio: "pipe",
    },
  );

  nextServer.stdout.on("data", (d) => (nextLogs += d.toString()));
  nextServer.stderr.on("data", (d) => (nextLogs += d.toString()));

  let chromeProcess = null;

  try {
    await waitForServer(TARGET_URL, () => nextLogs);
    console.log("Next.js server ready at", TARGET_URL);

    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
    console.log("Launching Headless Chromium Shell...");
    chromeProcess = spawn(
      CHROME_BIN,
      [
        "--no-sandbox",
        "--disable-gpu",
        `--user-data-dir=${USER_DATA_DIR}`,
        `--remote-debugging-port=${CDP_PORT}`,
        "--window-size=360,800",
      ],
      {
        stdio: "pipe",
      },
    );

    // Wait for CDP to be available
    const versionData = await waitForCdp(CDP_PORT);
    console.log("CDP Connected to:", versionData.Browser);

    const listRes = await fetch(`http://localhost:${CDP_PORT}/json/list`);
    const pages = await listRes.json();
    let pageTarget = pages.find((p) => p.type === "page");
    if (!pageTarget) {
      console.log("Opening new page target...");
      const newPageRes = await fetch(
        `http://localhost:${CDP_PORT}/json/new?${encodeURIComponent(TARGET_URL)}`,
        { method: "PUT" },
      );
      pageTarget = await newPageRes.json();
    }
    if (!pageTarget?.webSocketDebuggerUrl) {
      throw new Error("No page target found or created in Chrome CDP: " + JSON.stringify(pageTarget));
    }

    console.log("Connecting to WebSocket:", pageTarget.webSocketDebuggerUrl);
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let messageId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve) => {
        const id = messageId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener("message", handler);
            resolve(res.result);
          }
        };
        ws.addEventListener("message", handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    // Enable Page domain
    await sendCommand("Page.enable");

    // Set mobile viewport 360x800
    await sendCommand("Emulation.setDeviceMetricsOverride", {
      width: 360,
      height: 800,
      deviceScaleFactor: 1,
      mobile: true,
      fitWindow: false,
    });

    // Navigate to target URL
    console.log("Navigating to:", TARGET_URL);
    await sendCommand("Page.navigate", { url: TARGET_URL });

    // Wait for load and rendering
    await wait(2000);

    // Evaluate layout and inspect elements
    const evalResult = await sendCommand("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const clientWidth = docEl.clientWidth;
        const windowInnerWidth = window.innerWidth;
        const hasHorizontalScroll = scrollWidth > clientWidth;

        // Inspect hero buttons
        const buttons = Array.from(document.querySelectorAll('section a')).map(a => {
          const rect = a.getBoundingClientRect();
          const style = window.getComputedStyle(a);
          return {
            text: a.innerText.trim().replace(/\\s+/g, ' '),
            href: a.getAttribute('href'),
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            color: style.color,
            backgroundColor: style.backgroundColor,
            width: Math.round(rect.width * 100) / 100,
            height: Math.round(rect.height * 100) / 100,
            left: Math.round(rect.left * 100) / 100,
            right: Math.round(rect.right * 100) / 100,
            top: Math.round(rect.top * 100) / 100,
            bottom: Math.round(rect.bottom * 100) / 100,
            touchTargetAdequate: rect.width >= 44 && rect.height >= 44,
            withinViewport: rect.left >= 0 && rect.right <= clientWidth
          };
        });

        // Search for any element overflowing viewport width
        const overflowingElements = [];
        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > clientWidth + 1 || rect.left < -1) {
            overflowingElements.push({
              tag: el.tagName,
              className: el.className ? String(el.className).substring(0, 50) : '',
              right: rect.right,
              width: rect.width
            });
          }
        });

        return {
          viewport: { width: windowInnerWidth, height: window.innerHeight },
          clientWidth,
          scrollWidth,
          hasHorizontalScroll,
          overflowPixels: Math.max(0, scrollWidth - clientWidth),
          overflowingElementsCount: overflowingElements.length,
          overflowingElements,
          buttons
        };
      })()`,
    });

    const inspection = evalResult.result.value;
    console.log(
      "Inspection Results:\n",
      JSON.stringify(inspection, null, 2),
    );

    // Strict layout regression assertions
    if (inspection.hasHorizontalScroll) {
      throw new Error(
        `Viewport horizontal scroll detected! scrollWidth (${inspection.scrollWidth}px) exceeds clientWidth (${inspection.clientWidth}px)`,
      );
    }

    if (inspection.overflowPixels > 0) {
      throw new Error(
        `Viewport horizontal overflow detected: ${inspection.overflowPixels}px overflow`,
      );
    }

    if (inspection.overflowingElementsCount > 0) {
      throw new Error(
        `Detected ${inspection.overflowingElementsCount} overflowing elements: ${JSON.stringify(inspection.overflowingElements)}`,
      );
    }

    if (!inspection.buttons || inspection.buttons.length < 2) {
      throw new Error(
        `Expected at least 2 Hero buttons, found: ${inspection.buttons?.length ?? 0}`,
      );
    }

    for (const btn of inspection.buttons) {
      if (!btn.withinViewport) {
        throw new Error(
          `Hero button "${btn.text}" is outside viewport boundaries (left: ${btn.left}, right: ${btn.right}, clientWidth: ${inspection.clientWidth})`,
        );
      }
      if (!btn.touchTargetAdequate) {
        throw new Error(
          `Hero button "${btn.text}" touch target is inadequate (width: ${btn.width}px, height: ${btn.height}px, minimum 44x44px required)`,
        );
      }
      const fontSizeNum = Number.parseFloat(btn.fontSize);
      if (fontSizeNum < 18.67) {
        throw new Error(
          `Hero button "${btn.text}" font size ${btn.fontSize} is less than 18.67px (WCAG Large Text threshold)`,
        );
      }
    }

    // Capture screenshot
    const screenshotData = await sendCommand("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });

    if (screenshotData?.data) {
      fs.mkdirSync(path.dirname(SCREENSHOT_PATH), { recursive: true });
      fs.writeFileSync(SCREENSHOT_PATH, Buffer.from(screenshotData.data, "base64"));
      console.log("Screenshot successfully saved to:", SCREENSHOT_PATH);
    }

    ws.close();
  } finally {
    if (chromeProcess) {
      chromeProcess.kill("SIGKILL");
    }
    if (nextServer) {
      nextServer.kill("SIGKILL");
    }
    console.log("Cleaned up processes.");
  }
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
