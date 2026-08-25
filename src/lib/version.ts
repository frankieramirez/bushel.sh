/**
 * The version chip in the masthead. Resolved at build time from the GitHub
 * releases API so every deploy prints the truth; falls back to the constant
 * below when the API is unreachable or rate-limited in CI.
 *
 * Cloudflare Pages only rebuilds on a push to this repo, so cutting a bushel
 * release does not refresh this on its own — redeploy the site to pick it up.
 */
const FALLBACK = "0.3.1";

export async function latestVersion(): Promise<string> {
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
