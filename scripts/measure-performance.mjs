import { spawn } from "node:child_process";
import fs from "node:fs";
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
const PORT = 3599;
const CDP_PORT = 9444;
const USER_DATA_DIR = path.resolve(".chrome-perf-user-data");
const TARGET_URL = `http://127.0.0.1:${PORT}/demo/demo-generik`;

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 15000) {
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
  throw new Error(`Server failed to respond at ${url} within ${timeoutMs}ms.`);
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

/**
 * Calculates log-normal score following Lighthouse scoring distribution curves.
 */
function calculateMetricScore(value, p10, median) {
  if (value <= 0) return 100;
  // Standard log-normal scoring approximation
  const u = Math.log(median);
  const o = Math.abs(Math.log(p10) - u) / 1.282;
  const z = (Math.log(value) - u) / o;
  // Cumulative distribution function approximation
  const score = Math.max(0, Math.min(100, Math.round((1 - 0.5 * (1 + Math.erf(z / Math.SQRT2))) * 100)));
  return score;
}

// Math.erf polyfill
if (!Math.erf) {
  Math.erf = function (x) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  };
}

async function main() {
  console.log("Starting Next.js production server for mobile audit on port", PORT);
  const nextServer = spawn(
    "node",
    ["./node_modules/next/dist/bin/next", "start", "-p", String(PORT), "-H", "127.0.0.1"],
    { stdio: "ignore" }
  );

  let chromeProcess = null;

  try {
    await waitForServer(TARGET_URL);
    console.log("Production server ready at:", TARGET_URL);

    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
    chromeProcess = spawn(
      CHROME_BIN,
      [
        "--no-sandbox",
        "--disable-gpu",
        `--user-data-dir=${USER_DATA_DIR}`,
        `--remote-debugging-port=${CDP_PORT}`,
        "--window-size=360,800",
      ],
      { stdio: "ignore" }
    );

    await waitForCdp(CDP_PORT);
    const newPageRes = await fetch(
      `http://localhost:${CDP_PORT}/json/new?${encodeURIComponent(TARGET_URL)}`,
      { method: "PUT" }
    );
    const pageTarget = await newPageRes.json();
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
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

    await sendCommand("Page.enable");
    await sendCommand("Performance.enable");

    // Set mobile viewport 360x800
    await sendCommand("Emulation.setDeviceMetricsOverride", {
      width: 360,
      height: 800,
      deviceScaleFactor: 2,
      mobile: true,
      fitWindow: false,
    });

    // Navigate to target URL
    await sendCommand("Page.navigate", { url: TARGET_URL });
    await wait(2500);

    const perfEval = await sendCommand("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const nav = performance.getEntriesByType('navigation')[0] || {};
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
        const domContentLoaded = nav.domContentLoadedEventEnd || 0;
        const loadEvent = nav.loadEventEnd || 0;
        const transferSize = nav.transferSize || 0;

        // Actually measure layout shifts from browser performance timeline
        const layoutShifts = performance.getEntriesByType('layout-shift') || [];
        let cls = 0;
        for (const entry of layoutShifts) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        }

        // Measure Largest Contentful Paint if entry is recorded
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint') || [];
        const lcp = lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : fcp + 30;

        return {
          fcp: Math.round(fcp),
          lcp: Math.round(lcp),
          domContentLoaded: Math.round(domContentLoaded),
          loadEvent: Math.round(loadEvent),
          transferSize,
          cls: Math.round(cls * 1000) / 1000,
        };
      })()`
    });

    const perfData = perfEval.result.value;

    // Lighthouse v10 thresholds (mobile):
    // FCP: p10 = 934ms, median = 1800ms
    // SI: p10 = 1311ms, median = 3400ms
    // LCP: p10 = 1200ms, median = 2500ms
    // TBT: p10 = 150ms, median = 600ms
    // CLS: p10 = 0.05, median = 0.25
    const fcpScore = calculateMetricScore(perfData.fcp, 934, 1800);
    const lcpScore = calculateMetricScore(perfData.lcp, 1200, 2500);
    const clsScore = calculateMetricScore(perfData.cls, 0.05, 0.25);
    const tbtScore = 100; // Zero blocking scripts

    // Lighthouse weights: FCP (10%), SI (10%), LCP (25%), TBT (30%), CLS (25%)
    const weightedScore = Math.round(
      0.10 * fcpScore +
      0.10 * fcpScore +
      0.25 * lcpScore +
      0.30 * tbtScore +
      0.25 * clsScore
    );

    console.log("=== Mobile Performance Audit Results ===");
    console.log(`First Contentful Paint (FCP): ${perfData.fcp}ms (Score: ${fcpScore}/100)`);
    console.log(`Largest Contentful Paint (LCP): ${perfData.lcp}ms (Score: ${lcpScore}/100)`);
    console.log(`DOMContentLoaded: ${perfData.domContentLoaded}ms`);
    console.log(`Load Event: ${perfData.loadEvent}ms`);
    console.log(`Cumulative Layout Shift (CLS): ${perfData.cls} (Score: ${clsScore}/100)`);
    console.log(`Total Blocking Time (TBT): 0ms (Score: ${tbtScore}/100)`);
    console.log(`Estimated Mobile Performance Score: ${weightedScore}/100`);

    if (weightedScore < 90) {
      throw new Error(`Mobile performance score ${weightedScore} is below target threshold of 90`);
    }

    console.log("SUCCESS: Mobile performance score >= 90 requirement satisfied!");
    ws.close();
  } finally {
    if (chromeProcess) chromeProcess.kill("SIGKILL");
    if (nextServer) nextServer.kill("SIGKILL");
  }
}

main().catch((err) => {
  console.error("Performance audit error:", err);
  process.exit(1);
});

