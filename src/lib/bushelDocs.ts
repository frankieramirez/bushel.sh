/**
 * bushel's keymap and config reference, as data.
 *
 * The site builds on Cloudflare's Linux builders and bushel needs macOS 26 on
 * Apple silicon, so the reference pages cannot shell out for their tables.
 * bushel's release attaches `docs.json` instead, emitted from the same source
 * the running program reads, and this fetches it once per build. See
 * https://github.com/frankieramirez/bushel/issues/43.
 *
 * The copy in `src/data/docs.json` is what renders when the fetch fails, and
 * refreshing it is one command on a Mac with the bushel checkout:
 *
 *     cargo run --example docs-json -- --out ../bushel.sh/src/data/docs.json
 */
import fallback from "../data/docs.json";

/**
 * The shape this site knows how to render. bushel bumps its own
 * `schema_version` when the shape changes, and a release that has moved ahead
 * of this site falls back rather than rendering half a table.
 */
export const SCHEMA_VERSION = 1;

const DOCS_URL =
  "https://github.com/frankieramirez/bushel/releases/latest/download/docs.json";

const TIMEOUT_MS = 5000;

export interface Binding {
  /** As the cheatsheet prints it, e.g. `j/k g/G`. */
  keys: string;
  desc: string;
}

export interface KeyGroup {
  /** `global`, `list`, `detail` — the cheatsheet's own headings. */
  group: string;
  bindings: Binding[];
}

export interface ConfigOption {
  key: string;
  flag: string;
  /** Whatever `Config::default()` serialises to, including the layout name. */
  default: boolean | number | string;
  desc: string;
}

export interface ConfigDocs {
  path: string;
  options: ConfigOption[];
}

export interface BushelDocs {
  schema_version: number;
  /** The bushel release this was emitted from. The masthead chip prints it. */
  version: string;
  keymap: KeyGroup[];
  config: ConfigDocs;
}

/**
 * Resolved once per build, not once per page. Three pages read this and a
 * static build renders them in one process, so without the shared promise the
 * site would spend a round-trip per page learning the same thing.
 */
let inFlight: Promise<BushelDocs> | null = null;

export function bushelDocs(): Promise<BushelDocs> {
  return (inFlight ??= resolve());
}

async function resolve(): Promise<BushelDocs> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(DOCS_URL, {
      headers: { accept: "application/json", "user-agent": "bushel.sh-build" },
      signal: controller.signal,
    });
    if (!res.ok) return vendored(`the release asset answered ${res.status}`);

    const data: unknown = await res.json();
    const problem = wrongShape(data);
    if (problem) return vendored(problem);

    const docs = data as BushelDocs;
    console.log(`[docs.json] bushel ${docs.version}, from the latest release`);
    return docs;
  } catch (e) {
    return vendored(e instanceof Error ? e.message : String(e));
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Says what is wrong with a payload, or nothing if it is usable. A 404 page or
 * a truncated body parses as *something*, so the tables get checked for before
 * a page tries to walk them.
 */
function wrongShape(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return "the payload is not an object";
  const d = data as Partial<BushelDocs>;
  if (d.schema_version !== SCHEMA_VERSION) {
    return `schema_version ${d.schema_version} is not the ${SCHEMA_VERSION} this site renders`;
  }
  if (typeof d.version !== "string" || d.version === "") return "no version";
  if (!Array.isArray(d.keymap) || d.keymap.length === 0) return "no keymap";
  if (!Array.isArray(d.config?.options) || d.config.options.length === 0) {
    return "no config options";
  }
  return null;
}

/**
 * Loud on purpose. A silent fallback would publish a stale keymap looking
 * exactly like a fresh one, so the reason lands in the Cloudflare build log.
 */
function vendored(reason: string): BushelDocs {
  const docs = fallback as BushelDocs;
  console.warn(
    `[docs.json] falling back to the vendored copy (bushel ${docs.version}): ${reason}`,
  );
  return docs;
}
