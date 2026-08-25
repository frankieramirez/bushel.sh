/**
 * What Astro hands us for the current path depends on where we are: `/docs`
 * from the dev server, `/docs.html` from a `build.format: "file"` static build,
 * `/docs/` from the default directory build. Every comparison and every URL we
 * print — canonical tags, the sitemap, nav highlighting — has to agree on one
 * shape, and the shape Cloudflare Pages actually serves is `/docs`.
 */
export function normalisePath(pathname: string): string {
  const path = pathname
    .replace(/index\.html$/, "")
    .replace(/\.html$/, "")
    .replace(/\/+$/, "");
  return path === "" ? "/" : path;
}
