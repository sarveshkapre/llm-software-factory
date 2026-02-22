import fs from "node:fs/promises";
import path from "node:path";

import type { ScreenshotCaptureResult, ScreenshotPlanItem } from "@/lib/factory/types";

interface CaptureOptions {
  projectPath: string;
  screenshotPlan: ScreenshotPlanItem[];
}

const SCREENSHOT_DIR = "artifacts/screenshots";

function toAbsoluteOutputPath(projectPath: string, item: ScreenshotPlanItem): string {
  return path.join(projectPath, item.artifactPath);
}

function formatFailureMessage(url: string, reason: string): string {
  return `${url} -> ${reason}`;
}

export async function captureWebsiteScreenshots(
  options: CaptureOptions
): Promise<ScreenshotCaptureResult> {
  const screenshotDirectory = SCREENSHOT_DIR;
  const absoluteDirectory = path.join(options.projectPath, SCREENSHOT_DIR);

  await fs.mkdir(absoluteDirectory, { recursive: true });

  let playwrightModule: Awaited<typeof import("playwright")> | null = null;

  try {
    playwrightModule = await import("playwright");
  } catch {
    return {
      screenshotDirectory,
      capturedFiles: [],
      failures: [
        "Playwright is not available. Install runtime support with `npm install playwright` and run `npx playwright install chromium`.",
      ],
    };
  }

  const browser = await playwrightModule.chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const capturedFiles: string[] = [];
  const failures: string[] = [];

  try {
    for (const item of options.screenshotPlan) {
      const absolutePath = toAbsoluteOutputPath(options.projectPath, item);
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });

      try {
        await page.goto(item.url, {
          timeout: 30_000,
          waitUntil: "networkidle",
        });

        await page.screenshot({
          path: absolutePath,
          fullPage: true,
        });

        capturedFiles.push(path.relative(options.projectPath, absolutePath));
      } catch (error) {
        const reason = error instanceof Error ? error.message : "unknown error";
        failures.push(formatFailureMessage(item.url, reason));
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }

  return {
    screenshotDirectory,
    capturedFiles,
    failures,
  };
}
