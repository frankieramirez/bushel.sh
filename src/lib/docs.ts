/**
 * The docs table of contents, shared by the navigation and index.
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
    summary: "Install, upgrade, shell completions, and the man page.",
  },
  {
    no: "03",
    title: "Using bushel",
    href: "/docs/usage",
    summary: "Navigate the panes and work with containers, images, volumes and networks.",
  },
  {
    no: "04",
    title: "Keys",
    href: "/docs/keys",
    summary: "The generated cheatsheet and controls for dialogs and settings.",
  },
  {
    no: "05",
    title: "Config",
    href: "/docs/config",
    summary: "Layouts, saved settings, and the flags that override the file.",
  },
  {
    no: "06",
    title: "Troubleshooting",
    href: "/docs/troubleshooting",
    summary: "What to do when bushel will not start, connect, or draw.",
  },
  {
    no: "07",
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
