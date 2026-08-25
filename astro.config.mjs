// @ts-check
import { defineConfig } from "astro/config";

/**
 * Anything under `src/pages/docs/` gets the docs chrome without having to say
 * so. A Markdown page only needs a title and a description; drop the file in
 * and it comes out wearing the sidebar, the table of contents and the crate
 * masthead. An explicit `layout:` in the frontmatter still wins.
 */
function docsLayout() {
  return (/** @type {unknown} */ _tree, /** @type {any} */ file) => {
    const frontmatter = file.data?.astro?.frontmatter;
    const path = String(file.history?.[0] ?? "");
    if (frontmatter && !frontmatter.layout && path.includes("/src/pages/docs/")) {
      frontmatter.layout = "/src/layouts/Docs.astro";
    }
  };
}

// Static output (the default) — no adapter; Cloudflare Pages serves `dist`.
export default defineConfig({
  site: "https://bushel.sh",

  /*
   * Extensionless URLs with no trailing slash: `dist/docs.html` served at
   * `/docs`. Astro's default emits `dist/docs/index.html`, which Pages answers
   * with a 308 to `/docs/` — so the nav, the sitemap and the canonical tag all
   * pointed at a URL that redirected. One shape, agreed on everywhere.
   */
  build: { format: "file" },
  trailingSlash: "never",
  markdown: {
    remarkPlugins: [docsLayout],
    // bushel's own terminal palette is github-dark derived (src/ui/theme.rs),
    // so code blocks and the recorded session agree without a custom theme.
    shikiConfig: { theme: "github-dark" },
  },
});
