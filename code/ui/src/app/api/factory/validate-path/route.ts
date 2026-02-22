import { validateOutputRootPath } from "@/lib/factory/scaffold";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = (await request.json()) as { outputRootPath?: string };
    const validation = await validateOutputRootPath(payload.outputRootPath ?? "");

    return Response.json({ validation }, { status: validation.valid ? 200 : 400 });
  } catch {
    return Response.json(
      {
        validation: {
          valid: false,
          resolvedPath: "",
          message: "Path validation failed unexpectedly.",
        },
      },
      { status: 500 }
    );
  }
}
