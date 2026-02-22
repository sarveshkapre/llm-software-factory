import { runPromptToProduction } from "@/lib/factory/prompt-pipeline";

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = (await request.json()) as { prompt?: string };
    const prompt = payload.prompt?.trim() ?? "";

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

    const run = await runPromptToProduction(prompt);
    return Response.json({ run });
  } catch {
    return Response.json(
      { error: "Pipeline execution failed. Please retry with a clearer prompt." },
      { status: 500 }
    );
  }
}
