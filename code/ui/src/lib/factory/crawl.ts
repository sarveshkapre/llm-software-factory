import type { CrawlSnapshot, ScreenshotPlanItem } from "@/lib/factory/types";

const FEATURE_RULES: Array<{ label: string; keywords: string[] }> = [
  { label: "Authentication", keywords: ["login", "sign in", "account"] },
  { label: "Pricing", keywords: ["pricing", "plans", "billing"] },
  { label: "API", keywords: ["api", "developer", "docs"] },
  { label: "Templates", keywords: ["template", "example", "sample"] },
  { label: "Dashboard", keywords: ["dashboard", "workspace", "console"] },
  { label: "Enterprise/Security", keywords: ["security", "compliance", "enterprise", "sso"] },
];

function sanitizeSegment(segment: string): string {
  const clean = segment.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");
  return clean.length > 0 ? clean.toLowerCase() : "home";
}

function buildScreenshotPlan(urls: string[]): ScreenshotPlanItem[] {
  return urls.slice(0, 8).map((url) => {
    const parsed = new URL(url);
    const segment = sanitizeSegment(parsed.pathname);
    return {
      label: parsed.pathname === "/" ? "Home" : parsed.pathname,
      url,
      artifactPath: `artifacts/screenshots/${parsed.hostname}-${segment}.png`,
    };
  });
}

function absoluteUrl(base: string, href: string): string | null {
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return null;
  }

  try {
    const resolved = new URL(href, base);
    if (!["http:", "https:"].includes(resolved.protocol)) {
      return null;
    }
    return resolved.toString();
  } catch {
    return null;
  }
}

function extractLinks(html: string, baseUrl: string): string[] {
  const hrefPattern = /href=["']([^"']+)["']/gi;
  const found = new Set<string>();
  const baseHost = new URL(baseUrl).hostname;

  for (const match of html.matchAll(hrefPattern)) {
    const resolved = absoluteUrl(baseUrl, match[1]);
    if (!resolved) {
      continue;
    }

    const url = new URL(resolved);
    if (url.hostname !== baseHost) {
      continue;
    }

    url.hash = "";
    found.add(url.toString());
  }

  return Array.from(found);
}

function extractMetaDescription(html: string): string | null {
  const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
  return match ? match[1].trim() : null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

function detectFeatures(html: string): string[] {
  const lowered = html.toLowerCase();
  const features = FEATURE_RULES.filter((rule) =>
    rule.keywords.some((keyword) => lowered.includes(keyword))
  ).map((rule) => rule.label);

  return features.length > 0 ? features : ["Core Product Surface", "Primary Workflow", "Support Docs"];
}

export async function crawlWebsite(targetUrl: string): Promise<CrawlSnapshot> {
  const warnings: string[] = [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Failed to fetch target (${response.status}).`);
    }

    const html = await response.text();
    const title = extractTitle(html) ?? new URL(targetUrl).hostname;
    const summary =
      extractMetaDescription(html) ??
      "No meta description found. Use page copy and layout hierarchy during replication.";

    const links = extractLinks(html, targetUrl);
    const endpoints = [targetUrl, ...links]
      .map((link) => {
        const url = new URL(link);
        url.search = "";
        return url.toString();
      })
      .filter((value, index, all) => all.indexOf(value) === index)
      .slice(0, 12);

    if (endpoints.length < 3) {
      warnings.push("Limited internal links discovered. Add manual endpoint seeds for deep crawl.");
    }

    return {
      pageTitle: title,
      summary,
      endpoints,
      screenshotPlan: buildScreenshotPlan(endpoints),
      featureMap: detectFeatures(html),
      warnings,
    };
  } catch {
    const fallbackEndpoints = ["/", "/pricing", "/features", "/docs", "/login"].map(
      (path) => new URL(path, targetUrl).toString()
    );

    warnings.push("Target crawl failed. Returned baseline endpoint map from URL skeleton.");

    return {
      pageTitle: new URL(targetUrl).hostname,
      summary:
        "Automated crawl was unavailable. Proceed with baseline information architecture and manual screenshot capture.",
      endpoints: fallbackEndpoints,
      screenshotPlan: buildScreenshotPlan(fallbackEndpoints),
      featureMap: ["Landing", "Feature Pages", "Authentication", "Help/Docs"],
      warnings,
    };
  }
}
