import type { FactoryIntent, TargetSelection } from "@/lib/factory/types";

const BRAND_URL_MAP: Record<string, string> = {
  docusign: "https://www.docusign.com",
  roboflow: "https://roboflow.com",
  excalidraw: "https://excalidraw.com",
  figma: "https://www.figma.com",
  notion: "https://www.notion.so",
  airtable: "https://www.airtable.com",
};

const CATEGORY_COMPETITORS: Record<string, { url: string; reason: string }> = {
  "e-signature": {
    url: "https://www.docusign.com",
    reason: "Using leading e-signature product as market reference.",
  },
  "computer-vision": {
    url: "https://roboflow.com",
    reason: "Using active computer-vision workflow product as baseline.",
  },
  "collaboration-canvas": {
    url: "https://excalidraw.com",
    reason: "Using collaborative canvas leader for interaction baseline.",
  },
  marketplace: {
    url: "https://www.shopify.com",
    reason: "Using major commerce UX baseline for marketplace flows.",
  },
  productivity: {
    url: "https://linear.app",
    reason: "Using modern productivity reference for execution-focused UX.",
  },
  developer: {
    url: "https://stripe.com",
    reason: "Using API-first product reference for developer experience.",
  },
  "general software": {
    url: "https://www.notion.so",
    reason: "Using a broad modern SaaS reference when prompt is open-ended.",
  },
};

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
}

function domainFromProductName(productName: string): string {
  const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
  return `https://${slug}.com`;
}

async function probeUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

export async function resolveTarget(intent: FactoryIntent): Promise<TargetSelection> {
  if (intent.references.length > 0) {
    return {
      url: intent.references[0],
      strategy: "direct-url",
      reason: "Prompt includes an explicit website reference.",
    };
  }

  const normalizedName = normalizeName(intent.productName);

  for (const [brand, url] of Object.entries(BRAND_URL_MAP)) {
    if (normalizedName.includes(brand)) {
      return {
        url,
        strategy: "direct-url",
        reason: `Resolved known product '${brand}' to canonical website.`,
      };
    }
  }

  const guessedUrl = domainFromProductName(intent.productName);
  if (await probeUrl(guessedUrl)) {
    return {
      url: guessedUrl,
      strategy: "direct-url",
      reason: "Detected reachable website from inferred product domain.",
    };
  }

  const competitor = CATEGORY_COMPETITORS[intent.category] ?? CATEGORY_COMPETITORS["general software"];
  return {
    url: competitor.url,
    strategy: "competitor-fallback",
    reason: competitor.reason,
  };
}
