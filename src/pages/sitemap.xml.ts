import type { APIRoute } from "astro";

/**
 * The sitemap, generated from the routes that actually exist.
 *
 * This used to be a hand-written file in `public/` listing the single landing
 * page. Six docs pages are arriving one ticket at a time, and a list nobody is
 * forced to update is a list that goes stale — the same drift rule the docs
 * site was scoped around (https://github.com/frankieramirez/bushel/issues/42).
 *
 * The glob is build-time only: it names the files, and a page that has not been
 * written yet cannot be advertised to a crawler as though it had.
 */
const SITE = "https://bushel.sh";

const docs = Object.keys(import.meta.glob("./docs/**/*.{md,astro}"))
  .map((file) =>
    file
      .replace(/^\.\/docs/, "/docs")
      .replace(/\/index\.(md|astro)$/, "")
      .replace(/\.(md|astro)$/, ""),
  )
  .sort();

const paths = ["/", ...docs];

export const GET: APIRoute = () =>
  new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...paths.map((path) => `  <url>\n    <loc>${SITE}${path}</loc>\n  </url>`),
      "</urlset>",
      "",
    ].join("\n"),
    { headers: { "content-type": "application/xml" } },
  );
