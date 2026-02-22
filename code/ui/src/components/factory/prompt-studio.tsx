"use client";

import { useMemo, useState } from "react";
import { RunReport } from "@/components/factory/run-report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { FactoryRun } from "@/lib/factory/types";

const EXAMPLES = [
  "Build DocuSign for freelancers and agencies.",
  "Build Roboflow for retail quality inspection.",
  "Build Excalidraw with multiplayer rooms and templates.",
] as const;

export function PromptStudio() {
  const [prompt, setPrompt] = useState<string>(EXAMPLES[0]);
  const [run, setRun] = useState<FactoryRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(() => prompt.trim().length >= 8 && !isLoading, [prompt, isLoading]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/factory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const payload = (await response.json()) as { error?: string; run?: FactoryRun };

      if (!response.ok || !payload.run) {
        throw new Error(payload.error ?? "Unable to run prompt pipeline.");
      }

      setRun(payload.run);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unexpected error.");
      setRun(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="border-black/10 bg-card/80 backdrop-blur-sm">
        <CardHeader className="space-y-4">
          <Badge variant="outline" className="w-fit rounded-full border-black/20 px-3 py-1 uppercase">
            Prompt to Production
          </Badge>
          <CardTitle className="font-display text-4xl italic sm:text-5xl">
            What do you want to build?
          </CardTitle>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Enter one prompt. The system resolves a target, crawls the website, maps endpoints, prepares
            screenshot capture paths, and outputs a modular implementation blueprint.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Build a product like..."
              className="min-h-28 border-black/15 bg-background/70 text-base"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" className="rounded-full px-6" disabled={!canSubmit}>
                {isLoading ? "Running Pipeline..." : "Run Prompt"}
              </Button>
              <p className="text-xs text-muted-foreground">
                If target does not resolve, competitor fallback is selected automatically.
              </p>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 pt-1">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setPrompt(example)}
                className="rounded-full border border-black/15 px-3 py-1 text-xs text-foreground/80 transition hover:border-black/30"
              >
                {example}
              </button>
            ))}
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </CardContent>
      </Card>

      {run ? <RunReport run={run} /> : null}
    </div>
  );
}
