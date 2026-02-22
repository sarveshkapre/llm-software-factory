import type { BuildBlueprint, CrawlSnapshot, FactoryIntent, TargetSelection } from "@/lib/factory/types";

export function buildBlueprint(
  intent: FactoryIntent,
  target: TargetSelection,
  crawl: CrawlSnapshot
): BuildBlueprint {
  const featureDeliverables = crawl.featureMap.slice(0, 4).map((feature) => `${feature} module parity`);

  return {
    positioning: `Replicate ${intent.productName} with production-ready modular architecture using ${target.url} as baseline reference.`,
    modules: [
      {
        name: "Surface Replica",
        goal: "Recreate visible experience, information architecture, and responsive layout language.",
        deliverables: [
          "Global design tokens and typography system",
          "Reusable section/component registry",
          "Landing and navigation shell parity",
        ],
      },
      {
        name: "Feature Parity",
        goal: "Implement core workflows inferred from target pages and content patterns.",
        deliverables: featureDeliverables,
      },
      {
        name: "Production Backbone",
        goal: "Package for reliable deployment and iteration.",
        deliverables: [
          "API contracts + data layer",
          "Auth, billing, and telemetry hooks",
          "CI checks and release checklist",
        ],
      },
    ],
    phases: [
      "Phase 1: Crawl, screenshot, and endpoint validation",
      "Phase 2: UI system + page scaffolding",
      "Phase 3: Workflow implementation and backend integration",
      "Phase 4: QA hardening, deployment, and monitoring",
    ],
  };
}
