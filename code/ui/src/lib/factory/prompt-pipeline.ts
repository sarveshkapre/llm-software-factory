import { buildBlueprint } from "@/lib/factory/blueprint";
import { crawlWebsite } from "@/lib/factory/crawl";
import { inferIntent } from "@/lib/factory/intent";
import { resolveTarget } from "@/lib/factory/target-selection";
import type { FactoryRun, PipelineStep } from "@/lib/factory/types";

export async function runPromptToProduction(prompt: string): Promise<FactoryRun> {
  const intent = inferIntent(prompt);
  const target = await resolveTarget(intent);
  const crawl = await crawlWebsite(target.url);
  const blueprint = buildBlueprint(intent, target, crawl);

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
  ];

  return {
    prompt,
    createdAt: new Date().toISOString(),
    intent,
    target,
    pipeline,
    crawl,
    blueprint,
  };
}
