/**
 * The version chip in the masthead. Resolved at build time from the GitHub
 * releases API so every deploy prints the truth; falls back to the constant
 * below when the API is unreachable or rate-limited in CI.
 *
 * Cloudflare Pages only rebuilds on a push to this repo, so this used to go
 * stale on every bushel release. The bushel release workflow now POSTs a Pages
 * deploy hook after announcing, which rebuilds the site and re-resolves this —
 * see .github/workflows/deploy-site.yml on frankieramirez/bushel.
 */
const FALLBACK = "0.3.1";

/**
 * Resolved once per build, not once per page. The masthead is on every route,
 * and a static build renders them all in one process, so without this the docs
 * section would spend a network round-trip per page to learn the same tag.
 */
let inFlight: Promise<string> | null = null;

export function latestVersion(): Promise<string> {
  return (inFlight ??= resolve());
}

async function resolve(): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(
      "https://api.github.com/repos/frankieramirez/bushel/releases/latest",
      {
        headers: {
          accept: "application/vnd.github+json",
          "user-agent": "bushel.sh-build",
        },
        signal: controller.signal,
      },
    );
    if (!res.ok) return FALLBACK;

    const tag: unknown = (await res.json())?.tag_name;
    return typeof tag === "string" && tag.length > 0
      ? tag.replace(/^v/, "")
      : FALLBACK;
  } catch {
    return FALLBACK;
  } finally {
    clearTimeout(timeout);
  }
}
