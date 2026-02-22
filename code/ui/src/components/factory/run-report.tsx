import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { FactoryRun } from "@/lib/factory/types";

interface RunReportProps {
  run: FactoryRun;
}

export function RunReport({ run }: RunReportProps) {
  return (
    <div className="space-y-4">
      <Card className="border-black/10 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full border-black/20 uppercase">
              {run.target.strategy === "direct-url" ? "Direct Target" : "Competitor Fallback"}
            </Badge>
            <Badge variant="outline" className="rounded-full border-black/20">
              {run.intent.category}
            </Badge>
          </div>
          <CardTitle className="text-xl">{run.intent.productName}</CardTitle>
          <p className="text-sm text-muted-foreground">{run.target.reason}</p>
          <a
            href={run.target.url}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-foreground/80 underline underline-offset-4"
          >
            {run.target.url}
          </a>
        </CardHeader>
      </Card>

      <Card className="border-black/10 bg-card/70">
        <CardHeader>
          <CardTitle className="text-base">Local Scaffold Output</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-foreground/90">{run.scaffold.projectPath}</p>
          <p className="text-xs text-muted-foreground">
            {run.scaffold.fullOwnership ? "Full ownership" : "Minimal"} scaffold, {run.scaffold.createdFiles.length}
            {" "}
            files created.
          </p>
          <div className="max-h-40 space-y-1 overflow-auto rounded-lg border border-black/10 bg-background/60 p-3">
            {run.scaffold.createdFiles.map((file) => (
              <p key={file} className="font-mono text-[11px] text-foreground/80">
                {file}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-black/10 bg-card/70">
          <CardHeader>
            <CardTitle className="text-base">Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {run.pipeline.map((step) => (
              <div key={step.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{step.label}</p>
                  <Badge variant="outline" className="rounded-full border-black/20 text-[10px] uppercase">
                    {step.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{step.detail}</p>
                <Separator className="bg-black/10" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-black/10 bg-card/70">
          <CardHeader>
            <CardTitle className="text-base">Feature Map</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {run.crawl.featureMap.map((feature) => (
              <p key={feature} className="text-sm text-foreground/85">
                {feature}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-black/10 bg-card/70">
          <CardHeader>
            <CardTitle className="text-base">Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="max-h-72 space-y-2 overflow-auto">
            {run.crawl.endpoints.map((endpoint) => (
              <p key={endpoint} className="font-mono text-xs text-foreground/80">
                {endpoint}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card className="border-black/10 bg-card/70">
          <CardHeader>
            <CardTitle className="text-base">Screenshot Plan</CardTitle>
          </CardHeader>
          <CardContent className="max-h-72 space-y-3 overflow-auto">
            {run.crawl.screenshotPlan.map((item) => (
              <div key={item.url} className="space-y-1">
                <p className="text-sm">{item.label}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{item.artifactPath}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-black/10 bg-card/70">
        <CardHeader>
          <CardTitle className="text-base">Build Blueprint</CardTitle>
          <p className="text-sm text-muted-foreground">{run.blueprint.positioning}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {run.blueprint.modules.map((module) => (
            <div key={module.name} className="space-y-2">
              <p className="text-sm font-medium">{module.name}</p>
              <p className="text-sm text-muted-foreground">{module.goal}</p>
              <div className="space-y-1">
                {module.deliverables.map((deliverable) => (
                  <p key={deliverable} className="text-xs text-foreground/80">
                    {deliverable}
                  </p>
                ))}
              </div>
              <Separator className="bg-black/10" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
