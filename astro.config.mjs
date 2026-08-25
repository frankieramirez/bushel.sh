// @ts-check
import { defineConfig } from "astro/config";

// Static output (the default) — no adapter; Cloudflare Pages serves `dist`.
export default defineConfig({
  site: "https://bushel.sh",
});
