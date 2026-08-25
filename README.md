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

The page implements the "Crate, as a page" canvas locked in
[issue #32](https://github.com/frankieramirez/bushel/issues/32). That canvas is
the source of visual truth, so take changes to the look there first. It asks for
an orchard-green fruit-crate label, flat colour with hard edges, a two-colour
press rhythm that flips to green ink on cream for the features band, and
FIG-numbered sections. Bevan carries the claim, JetBrains Mono the stencil
labels and commands. Body text is Archivo.

Fonts are self-hosted in `public/fonts` as latin subsets pulled from Google
Fonts. The `↗` and `◂` marks are drawn as SVG because they fall outside that
subset and would drop to a system face if they were typed.

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

The release workflow only started attaching the asset after v0.3.1, so the fetch
404s today and every build serves the vendored copy. Refresh it from a Mac with
the bushel checkout:

```sh
cargo run --example docs-json -- --out ../bushel.sh/src/data/docs.json
```

Pages only rebuilds on a push here, so a bushel release would leave the chip and
the tables a version behind. `deploy-site.yml` on the bushel repo closes that
loop, firing the `BUSHEL_SH_DEPLOY_HOOK` deploy hook after a stable release
announces.

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

`public/og.png` is a hand-rendered 1200×630 card, committed as an asset and
redrawn by hand whenever the claim or the palette changes.

Planned on the [bushel.sh wayfinder map](https://github.com/frankieramirez/bushel/issues/31).
