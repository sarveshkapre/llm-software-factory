export type TargetStrategy = "direct-url" | "competitor-fallback";

export type PipelineStatus = "completed" | "degraded";

export interface PipelineStep {
  id: string;
  label: string;
  status: PipelineStatus;
  detail: string;
}

export interface FactoryIntent {
  productName: string;
  category: string;
  references: string[];
}

export interface TargetSelection {
  url: string;
  strategy: TargetStrategy;
  reason: string;
}

export interface ScreenshotPlanItem {
  label: string;
  url: string;
  artifactPath: string;
}

export interface CrawlSnapshot {
  pageTitle: string;
  summary: string;
  endpoints: string[];
  screenshotPlan: ScreenshotPlanItem[];
  featureMap: string[];
  warnings: string[];
}

export interface BlueprintModule {
  name: string;
  goal: string;
  deliverables: string[];
}

export interface BuildBlueprint {
  positioning: string;
  modules: BlueprintModule[];
  phases: string[];
}

export interface FactoryRun {
  prompt: string;
  createdAt: string;
  intent: FactoryIntent;
  target: TargetSelection;
  pipeline: PipelineStep[];
  crawl: CrawlSnapshot;
  blueprint: BuildBlueprint;
}
