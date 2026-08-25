/**
 * The docs table of contents — the one place the six pages are listed.
 *
 * The sidebar, the mobile ribbon and the docs index all read this array, so
 * adding a page means adding an entry here and dropping the file in
 * `src/pages/docs/`. The `no` is the plate number the crate label prints
 * beside each entry; it is the array order, written out.
 *
 * Scope for the docs site was settled in
 * https://github.com/frankieramirez/bushel/issues/42
 */
import { normalisePath } from "./url";

export interface DocsPage {
  /** Plate number, printed in the sidebar and on the page header. */
  no: string;
  /** Sidebar and page-header title. */
  title: string;
  /** Route, no trailing slash. */
  href: string;
  /** One line, for the docs index cards and the sidebar's title attribute. */
  summary: string;
}

export const DOCS_PAGES: DocsPage[] = [
  {
    no: "01",
    title: "Overview",
    href: "/docs",
    summary: "What bushel is, and where to go next.",
  },
  {
    no: "02",
    title: "Install",
    href: "/docs/install",
    summary: "Every install method, the environment knobs, and how to upgrade.",
  },
  {
    no: "03",
    title: "Keys",
    href: "/docs/keys",
    summary: "The full keymap, generated from bushel's own cheatsheet.",
  },
  {
    no: "04",
    title: "Config",
    href: "/docs/config",
    summary: "Config file options and the CLI flags that override them.",
  },
  {
    no: "05",
    title: "Troubleshooting",
    href: "/docs/troubleshooting",
    summary: "What to do when bushel will not start, connect, or draw.",
  },
  {
    no: "06",
    title: "Why",
    href: "/docs/why",
    summary: "Why a TUI for Apple Containers, and the arguments behind its shape.",
  },
];

export function currentDocsPage(pathname: string): DocsPage | undefined {
  const path = normalisePath(pathname);
  return DOCS_PAGES.find((page) => page.href === path);
}

export function isDocsPath(pathname: string): boolean {
  const path = normalisePath(pathname);
  return path === "/docs" || path.startsWith("/docs/");
}
