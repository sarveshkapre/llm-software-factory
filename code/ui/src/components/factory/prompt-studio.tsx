"use client";

import { useEffect, useMemo, useState } from "react";

import { RunReport } from "@/components/factory/run-report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FactoryRun, PathValidationResult } from "@/lib/factory/types";

const EXAMPLES = [
  "Build DocuSign for freelancers and agencies.",
  "Build Roboflow for retail quality inspection.",
  "Build Excalidraw with multiplayer rooms and templates.",
] as const;

interface FactoryRunResponse {
  error?: string;
  run?: FactoryRun;
  pathValidation?: PathValidationResult;
}

interface PathValidationResponse {
  validation: PathValidationResult;
}

export function PromptStudio() {
  const [prompt, setPrompt] = useState<string>(EXAMPLES[0]);
  const [outputRootPath, setOutputRootPath] = useState<string>("");
  const [fullOwnership, setFullOwnership] = useState<boolean>(true);
  const [pathValidation, setPathValidation] = useState<PathValidationResult | null>(null);
  const [run, setRun] = useState<FactoryRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPathLoading, setIsPathLoading] = useState(true);
  const [isPathValidating, setIsPathValidating] = useState(false);

  const canSubmit = useMemo(
    () => prompt.trim().length >= 8 && outputRootPath.trim().length > 0 && !isLoading && !isPathLoading,
    [prompt, outputRootPath, isLoading, isPathLoading]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadDefaults() {
      setIsPathLoading(true);
      try {
        const response = await fetch("/api/factory", { method: "GET" });
        const payload = (await response.json()) as { defaultOutputRootPath?: string };

        if (cancelled) {
          return;
        }

        const defaultPath = payload.defaultOutputRootPath ?? "";
        setOutputRootPath(defaultPath);
      } catch {
        if (!cancelled) {
          setError("Unable to fetch default local path.");
        }
      } finally {
        if (!cancelled) {
          setIsPathLoading(false);
        }
      }
    }

    loadDefaults();

    return () => {
      cancelled = true;
    };
  }, []);

  async function validatePath(pathValue: string): Promise<PathValidationResult | null> {
    setIsPathValidating(true);

    try {
      const response = await fetch("/api/factory/validate-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outputRootPath: pathValue }),
      });

      const payload = (await response.json()) as PathValidationResponse;
      setPathValidation(payload.validation);
      return payload.validation;
    } catch {
      const fallback = {
        valid: false,
        resolvedPath: "",
        message: "Path validation request failed.",
      } satisfies PathValidationResult;
      setPathValidation(fallback);
      return fallback;
    } finally {
      setIsPathValidating(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const validation = await validatePath(outputRootPath);
      if (!validation || !validation.valid) {
        throw new Error(validation?.message ?? "Invalid output path.");
      }

      const response = await fetch("/api/factory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          outputRootPath: validation.resolvedPath,
          fullOwnership,
        }),
      });

      const payload = (await response.json()) as FactoryRunResponse;

      if (!response.ok || !payload.run) {
        throw new Error(payload.error ?? "Unable to run prompt pipeline.");
      }

      setRun(payload.run);
      if (payload.pathValidation) {
        setPathValidation(payload.pathValidation);
      }
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
            One prompt to local execution. The system resolves a target, crawls pages, maps endpoints,
            captures screenshots, and scaffolds a complete project under your selected local root path.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={onSubmit} className="space-y-5">
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Build a product like..."
              className="min-h-28 border-black/15 bg-background/70 text-base"
            />

            <div className="space-y-3 rounded-2xl border border-black/10 bg-background/40 p-4">
              <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">Local Build Output</p>
              <Input
                value={outputRootPath}
                onChange={(event) => {
                  setOutputRootPath(event.target.value);
                  setPathValidation(null);
                }}
                placeholder="/absolute/path/for/generated-projects"
                className="border-black/15 bg-background"
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-black/20 px-4"
                  onClick={() => void validatePath(outputRootPath)}
                  disabled={isPathValidating || isPathLoading || outputRootPath.trim().length === 0}
                >
                  {isPathValidating ? "Validating..." : "Validate Path"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Default path is the current runtime directory.
                </p>
              </div>
              {pathValidation ? (
                <p className={`text-xs ${pathValidation.valid ? "text-emerald-700" : "text-red-600"}`}>
                  {pathValidation.message} {pathValidation.resolvedPath ? `(${pathValidation.resolvedPath})` : ""}
                </p>
              ) : null}

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={fullOwnership}
                  onChange={(event) => setFullOwnership(event.target.checked)}
                  className="h-4 w-4 rounded border-black/30"
                />
                <span>Full ownership scaffolding (create complete project skeleton)</span>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" className="rounded-full px-6" disabled={!canSubmit}>
                {isLoading ? "Running Pipeline..." : "Run Prompt"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Project README will include: Built by Codex, LLM AI Software Factory.
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
