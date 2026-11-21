import { NextResponse } from "next/server";
import { normalizeTrendText, parseGoogleTrendsRss } from "../../../../lib/market-trends";

export const runtime = "nodejs";

const marketFeeds: Record<string, string[]> = {
  "Moçambique": ["MZ"],
  "Brasil": ["BR"],
  "Portugal": ["PT"],
  "África do Sul": ["ZA"],
  "Europa": ["GB", "DE", "FR"],
  "EUA": ["US"],
  "Global": ["US", "BR", "GB"],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market") ?? "";
  const query = (searchParams.get("q") ?? "").trim().slice(0, 80);

  if (!Object.prototype.hasOwnProperty.call(marketFeeds, market)) {
    return NextResponse.json({ error: "Mercado inválido." }, { status: 400 });
  }

  const geos = marketFeeds[market];
  const responses = await Promise.all(geos.map(async (geo) => {
    try {
      const response = await fetch(`https://trends.google.com/trending/rss?geo=${geo}`, {
        headers: { "User-Agent": "AI-Business-Autopilot/1.0" },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return { geo, ok: false, trends: [] as ReturnType<typeof parseGoogleTrendsRss> };
      const xml = await response.text();
      return { geo, ok: true, trends: parseGoogleTrendsRss(xml, geo) };
    } catch {
      return { geo, ok: false, trends: [] as ReturnType<typeof parseGoogleTrendsRss> };
    }
  }));

  const trends = responses.flatMap((result) => result.trends);
  const normalizedQuery = normalizeTrendText(query);
  const matches = normalizedQuery
    ? trends.filter((trend) => normalizeTrendText(trend.title).includes(normalizedQuery))
    : [];

  return NextResponse.json({
    source: "Google Trends — Trending searches RSS",
    market,
    query,
    checkedAt: new Date().toISOString(),
    feeds: responses.map(({ geo, ok, trends: feedTrends }) => ({ geo, ok, count: feedTrends.length })),
    trends,
    matches,
    note: "A lista mostra pesquisas em tendência no país/região, não volume de procura pelo produto. Ausência de correspondência não significa ausência de procura. O índice/volume absoluto de pesquisa não é fornecido por este feed.",
  });
}
