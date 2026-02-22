import fs from "node:fs/promises";
import path from "node:path";

import { buildBlueprint } from "@/lib/factory/blueprint";
import { crawlWebsite } from "@/lib/factory/crawl";
import { inferIntent } from "@/lib/factory/intent";
import { scaffoldProject } from "@/lib/factory/scaffold";
import { captureWebsiteScreenshots } from "@/lib/factory/screenshots";
import { resolveTarget } from "@/lib/factory/target-selection";
import type { FactoryRun, PipelineStep } from "@/lib/factory/types";

interface RunOptions {
  outputRootPath: string;
  fullOwnership: boolean;
}

export async function runPromptToProduction(prompt: string, options: RunOptions): Promise<FactoryRun> {
  const intent = inferIntent(prompt);
  const target = await resolveTarget(intent);
  const crawl = await crawlWebsite(target.url);
  const blueprint = buildBlueprint(intent, target, crawl);

  const runWithoutScaffold = {
    prompt,
    createdAt: new Date().toISOString(),
    intent,
    target,
    crawl,
    blueprint,
  };

  const scaffold = await scaffoldProject({ ...runWithoutScaffold, pipeline: [] }, options);
  const screenshots = await captureWebsiteScreenshots({
    projectPath: scaffold.projectPath,
    screenshotPlan: crawl.screenshotPlan,
  });

  scaffold.createdFiles.push(...screenshots.capturedFiles);

  const pipeline: PipelineStep[] = [
    {
      id: "intent",
      label: "Intent Extraction",
      status: "completed",
      detail: `Parsed target as '${intent.productName}' in '${intent.category}' category.`,
    },
    {
      id: "target",
      label: "Target Selection",
      status: "completed",
      detail: target.reason,
    },
    {
      id: "crawl",
      label: "Crawl + Endpoint Mapping",
      status: crawl.warnings.length > 0 ? "degraded" : "completed",
      detail:
        crawl.warnings[0] ?? `Mapped ${crawl.endpoints.length} endpoint(s) with screenshot capture plan.`,
    },
    {
      id: "blueprint",
      label: "Build Blueprint",
      status: "completed",
      detail: `Prepared ${blueprint.modules.length} implementation module(s).`,
    },
    {
      id: "screenshots",
      label: "Website Screenshots",
      status: screenshots.failures.length > 0 ? "degraded" : "completed",
      detail:
        screenshots.failures[0] ??
        `Captured ${screenshots.capturedFiles.length} screenshot(s) into '${screenshots.screenshotDirectory}'.`,
    },
    {
      id: "scaffold",
      label: "Local Scaffold",
      status: "completed",
      detail: `Created '${scaffold.projectPath}' with ${scaffold.createdFiles.length} file(s).`,
    },
  ];

  const run: FactoryRun = {
    ...runWithoutScaffold,
    pipeline,
    screenshots,
    scaffold,
  };

  await fs.writeFile(
    path.join(scaffold.projectPath, "factory/run.json"),
    JSON.stringify(run, null, 2),
    "utf8"
  );

  return run;
}
