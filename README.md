# bushel.sh

The website for [bushel](https://github.com/frankieramirez/bushel), a terminal
UI for managing Apple Containers.

Astro with static output, deployed on Cloudflare Pages. Build command
`npm run build`, output directory `dist`, `NODE_VERSION=22`.

```sh
npm install
npm run dev
```

## URLs and layouts

`build.format: "file"` plus `trailingSlash: "never"` means one URL shape
everywhere: `dist/docs.html` served at `/docs`, so the canonical tag, the
sitemap, the nav and the URL Pages actually serves all agree. Astro's default
would emit `dist/docs/index.html`, which Pages answers with a 308 to `/docs/`,
and then
every link points at a redirect. `src/lib/url.ts` normalises whatever Astro
hands a component, since the dev server and the static build disagree about
extensions.

Drop a Markdown file in `src/pages/docs/` with a title and a description and it
comes out wearing the docs chrome. A remark plugin in `astro.config.mjs` sets
the layout; frontmatter that names its own `layout:` still wins.

`public/_redirects` sends `/install` to the installer attached to the latest
GitHub release. The domain only ever hands out a 302, so the script people pipe
into `sh` stays next to the archive it installs.

## The design

The site is direction D, "One Bushel, Printed", from `design/bushel.pen`, a
pen.dev file. That file is the source of visual truth, so take changes to the
look there first. It's a two-ink risograph zine: fluorescent pink and medium
blue on warm paper, overprinting to purple wherever they cross
(`mix-blend-mode: multiply`). Big Shoulders carries the figures, Instrument Sans
the reading, DM Mono the commands and the small print.

The fluorescent pink only clears 3:1 on the paper, so it's kept for large type.
Small pink text uses the deeper `--pink-ink`. The basket print in `public/img/`
was generated for the page, and the colophon says so.

Motion follows bushel's own rules: nothing waits on it, no interaction runs past
150 ms, and `prefers-reduced-motion` turns all of it off. There are four pieces.
The recording plays as a blue duotone. The tear-off tabs on the install flyer
come away when you copy from them, then grow back. The blue plate drifts out of
register as the packing list and the colophon scroll past; that one is
scroll-driven CSS, so a browser without `animation-timeline` prints in register.
The taped print lifts on hover.

Fonts are self-hosted in `public/fonts` as latin subsets pulled from Google
Fonts. Arrows are drawn as SVG (`Arrow.astro`, `ExternalArrow.astro`) because
`→` and `↗` fall outside that subset and would drop to a system face if they
were typed. Code blocks use Shiki's `css-variables` theme, inked in
`global.css`.

## The generated docs pages

`/docs/keys` and `/docs/config` are built from data, and the masthead version
chip reads the same source. Cloudflare builds on Linux while bushel needs
macOS 26 on Apple silicon, so the site can't shell out to the binary for its
tables. Each bushel release attaches a `docs.json` emitted from the same source
the running program reads, and `src/lib/bushelDocs.ts` fetches it once per build
(see [issue #43](https://github.com/frankieramirez/bushel/issues/43)).

It falls back to the vendored copy in `src/data/docs.json` when that fetch
fails, and again when a release's `schema_version` has moved ahead of the
`SCHEMA_VERSION` this site knows how to render. The build log carries a
`[docs.json]` line saying which copy won and why.

The bundled reference currently matches bushel v0.3.4. Refresh it from the
bushel checkout when updating the site for a release:

```sh
cargo run --example docs-json -- --out ../bushel.sh/src/data/docs.json
```

`deploy-site.yml` in the bushel repo triggers the `BUSHEL_SH_DEPLOY_HOOK` after
a stable release announces, rebuilding the site with that release's tables.
The generated pages show the data's version, which may differ from an older
binary a reader has installed.

The handwritten guides still need a release review. Compare the CLI, config,
key dispatcher and available actions with the overview, install, usage, keys,
config, troubleshooting and why pages. Check the homepage claims too. New
subcommands, environment variables and dialog controls are not included in
`docs.json`; document them explicitly. Completion scripts and `bushel.1` are
linked from the install page to the release assets.

After updating the bundled reference and guides, run `npm run build`. Check the
`[docs.json]` line for the source and version used, then preview the pages at
desktop and phone widths. A build that falls back can still succeed, so compare
the bundled version with the intended release before publishing.

## The demo

`public/demo/` holds the recording rendered from
[`demo/bushel-demo.tape`](https://github.com/frankieramirez/bushel/tree/main/demo)
on the bushel repo. To refresh it after a release:

```sh
# in the bushel checkout
demo/setup.sh && vhs demo/bushel-demo.tape && demo/teardown.sh
cp demo/bushel-demo.{mp4,webm} ../bushel.sh/public/demo/
ffmpeg -ss 9 -i demo/bushel-demo.mp4 -frames:v 1 -q:v 4 \
  ../bushel.sh/public/demo/bushel-demo-poster.jpg -y
```

## The social card

`public/og.png` is a 1200×630 card exported from the "D · Social card" frame in
`design/bushel.pen`. Redraw it there whenever the claim or the palette changes.

Planned on the [bushel.sh wayfinder map](https://github.com/frankieramirez/bushel/issues/31).
