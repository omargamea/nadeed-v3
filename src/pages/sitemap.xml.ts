import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const lt = String.fromCharCode(60);
const gt = String.fromCharCode(62);
const amp = String.fromCharCode(38);

function escapeXml(value: string): string {
  return value
    .split(amp).join(amp + "amp;")
    .split(lt).join(amp + "lt;")
    .split(gt).join(amp + "gt;")
    .split(String.fromCharCode(34)).join(amp + "quot;")
    .split(String.fromCharCode(39)).join(amp + "apos;");
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() || "https://nadeed.vercel.app").replace(/\/$/, "");
  const today = formatDate(new Date());

  const rows: string[] = [];

  function addUrl(pathname: string, lastmod: string, changefreq: string, priority: string) {
    const absoluteUrl = new URL(pathname, `${base}/`).href;
    rows.push(`  ${lt}url${gt}
    ${lt}loc${gt}${escapeXml(absoluteUrl)}${lt}/loc${gt}
    ${lt}lastmod${gt}${lastmod}${lt}/lastmod${gt}
    ${lt}changefreq${gt}${changefreq}${lt}/changefreq${gt}
    ${lt}priority${gt}${priority}${lt}/priority${gt}
  ${lt}/url${gt}`);
  }

  addUrl("/", today, "weekly", "1.0");
  addUrl("/articles/", today, "weekly", "0.9");
  addUrl("/books/", today, "weekly", "0.9");
  addUrl("/magazine/", today, "monthly", "0.8");
  addUrl("/authors/", today, "monthly", "0.7");
  addUrl("/about/", today, "yearly", "0.6");
  addUrl("/shuroot/", today, "yearly", "0.6");
  addUrl("/contact/", today, "yearly", "0.5");

  const articles = await getCollection("articles", entry => !entry.data.draft);
  const books = await getCollection("books", entry => !entry.data.draft);
  const authors = await getCollection("authors", entry => !entry.data.draft);
  const magazine = await getCollection("magazine", entry => !entry.data.draft);

  for (const article of articles) {
    const lastmod = formatDate(article.data.updatedAt ?? article.data.publishedAt);
    addUrl(`/articles/${article.slug}/`, lastmod, "monthly", "0.8");
  }

  for (const book of books) {
    addUrl(`/books/${book.slug}/`, today, "monthly", "0.8");
  }

  for (const author of authors) {
    addUrl(`/authors/${author.slug}/`, today, "monthly", "0.7");
  }

  for (const issue of magazine) {
    const lastmod = formatDate(issue.data.publishedAt);
    addUrl(`/magazine/${issue.slug}/`, lastmod, "monthly", "0.7");
  }

  const xml = `${lt}?xml version="1.0" encoding="UTF-8"?${gt}
${lt}urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${gt}
${rows.join("\n")}
${lt}/urlset${gt}`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
};
