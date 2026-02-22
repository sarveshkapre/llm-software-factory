import type { FactoryIntent } from "@/lib/factory/types";

const URL_PATTERN = /(https?:\/\/[^\s)]+|(?:www\.)[^\s)]+)/gi;

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "e-signature": ["docusign", "signature", "sign", "contract"],
  "computer-vision": ["roboflow", "vision", "annotation", "dataset"],
  "collaboration-canvas": ["excalidraw", "whiteboard", "canvas", "diagram"],
  marketplace: ["shop", "commerce", "store", "marketplace"],
  productivity: ["todo", "task", "calendar", "project"],
  developer: ["api", "sdk", "developer", "docs"],
};

function normalizeUrl(raw: string): string {
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  return `https://${raw}`;
}

function inferProductName(prompt: string): string {
  const trimmed = prompt.trim();
  const match = trimmed.match(/(?:build|create|make)\s+(.+?)(?:$|,|\.\s|\?|!)/i);
  if (!match) {
    return "Untitled Product";
  }
  return match[1].replace(/^a\s+/i, "").replace(/^an\s+/i, "").trim();
}

function inferCategory(prompt: string): string {
  const lowered = prompt.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => lowered.includes(keyword))) {
      return category;
    }
  }
  return "general software";
}

export function inferIntent(prompt: string): FactoryIntent {
  const references = Array.from(prompt.matchAll(URL_PATTERN), (match) => normalizeUrl(match[0]));

  return {
    productName: inferProductName(prompt),
    category: inferCategory(prompt),
    references,
  };
}
