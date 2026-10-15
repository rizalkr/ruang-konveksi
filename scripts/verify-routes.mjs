import { spawn } from "node:child_process";

const PORT = 3567;

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  let serverLogs = "";
  const nextServer = spawn(
    "node",
    ["./node_modules/next/dist/bin/next", "start", "-p", String(PORT), "-H", "127.0.0.1"],
    { stdio: "pipe" },
  );

  nextServer.stdout?.on("data", (d) => { serverLogs += d.toString(); });
  nextServer.stderr?.on("data", (d) => { serverLogs += d.toString(); });

  try {
    let ready = false;
    for (let i = 0; i < 40; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/demo/demo-generik`);
        if (res.status === 200) {
          ready = true;
          break;
        }
      } catch {}
      await wait(250);
    }

    if (!ready) {
      throw new Error(`Server failed to start. Logs:\n${serverLogs}`);
    }

    // 1. Verify demo route
    const demoRes = await fetch(`http://127.0.0.1:${PORT}/demo/demo-generik`);
    console.log("Demo route status:", demoRes.status);
    const demoHtml = await demoRes.text();
    const hasBrandTitle = demoHtml.includes("Rumah Konveksi");
    const hasWaUrl = demoHtml.includes("wa.me/6281529964902");
    const hasCalculatorAnchor = demoHtml.includes('href="#kalkulator"');
    console.log("Demo content checks:", { hasBrandTitle, hasWaUrl, hasCalculatorAnchor });
    if (!hasBrandTitle || !hasWaUrl || !hasCalculatorAnchor || demoRes.status !== 200) {
      throw new Error("Demo route content check failed");
    }

    // 2. Verify 404 route
    const notFoundRes = await fetch(`http://127.0.0.1:${PORT}/demo/non-existent-konveksi`);
    console.log("404 route status:", notFoundRes.status);
    const notFoundHtml = await notFoundRes.text();
    const has404Text = notFoundHtml.includes("Halaman Tidak Ditemukan");
    console.log("404 content check:", { has404Text });
    if (notFoundRes.status !== 404 || !has404Text) {
      throw new Error("404 route check failed");
    }

    // 3. Verify root redirect
    const rootRes = await fetch(`http://127.0.0.1:${PORT}/`, { redirect: "manual" });
    console.log("Root route status:", rootRes.status, "Location:", rootRes.headers.get("location"));

    console.log("All route regression checks passed successfully.");
  } finally {
    nextServer.kill("SIGKILL");
  }
}

main().catch((e) => {
  console.error("Route check error:", e);
  process.exit(1);
});

