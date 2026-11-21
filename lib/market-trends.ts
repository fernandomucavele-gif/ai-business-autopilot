export type MarketTrend = {
  title: string;
  traffic: string;
  publishedAt: string;
  link: string;
  geo: string;
};

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function tagValue(xml: string, tag: string): string {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(new RegExp("<" + escaped + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + escaped + ">", "i"));
  return match ? decodeXml(match[1].trim()) : "";
}

export function parseGoogleTrendsRss(xml: string, geo: string): MarketTrend[] {
  const items = xml.match(/<item(?:\\s[^>]*)?>[\\s\\S]*?<\\/item>/gi) ?? [];
  return items.map((item) => ({
    title: tagValue(item, "title"),
    traffic: tagValue(item, "ht:approx_traffic") || "Não indicado",
    publishedAt: tagValue(item, "pubDate"),
    link: tagValue(item, "link"),
    geo,
  })).filter((item) => item.title.length > 0 && /^https?:\\/\\//i.test(item.link));
}

export function normalizeTrendText(value: string): string {
  return value.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLocaleLowerCase().trim();
}
