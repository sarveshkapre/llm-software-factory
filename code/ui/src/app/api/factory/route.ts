import { runPromptToProduction } from "@/lib/factory/prompt-pipeline";
import { validateOutputRootPath } from "@/lib/factory/scaffold";
import type { RunPromptRequest } from "@/lib/factory/types";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  return Response.json({ defaultOutputRootPath: process.cwd() });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = (await request.json()) as Partial<RunPromptRequest>;
    const prompt = payload.prompt?.trim() ?? "";
    const outputRootPath = payload.outputRootPath?.trim() ?? "";
    const fullOwnership = payload.fullOwnership ?? true;

    if (prompt.length < 8) {
      return Response.json(
        { error: "Prompt is too short. Describe what product you want to build." },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return Response.json(
        { error: "Prompt is too long. Keep it under 500 characters." },
        { status: 400 }
      );
    }

    const pathValidation = await validateOutputRootPath(outputRootPath);
    if (!pathValidation.valid) {
      return Response.json(
        {
          error: `Invalid output path: ${pathValidation.message}`,
          pathValidation,
        },
        { status: 400 }
      );
    }

    const run = await runPromptToProduction(prompt, {
      outputRootPath: pathValidation.resolvedPath,
      fullOwnership,
    });

    return Response.json({ run, pathValidation });
  } catch {
    return Response.json(
      { error: "Pipeline execution failed. Please retry with a clearer prompt." },
      { status: 500 }
    );
  }
}
