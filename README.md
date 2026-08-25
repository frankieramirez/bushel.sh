# bushel.sh

The website for [bushel](https://github.com/frankieramirez/bushel), a terminal
UI for managing Apple Containers.

Astro, static output, deployed on Cloudflare Pages (build: `npm run build`,
output: `dist`, `NODE_VERSION=22`). `public/_redirects` sends `/install` to the
canonical GitHub-releases installer — the domain never hosts a copy of the
script.

```sh
npm install
npm run dev
```

## The design

The page implements the "Crate, as a page" canvas locked in
[issue #32](https://github.com/frankieramirez/bushel/issues/32) — that canvas is
the source of visual truth, so take changes to the look there first. In short:
orchard-green fruit-crate label, flat colour and hard edges, a two-colour press
rhythm that flips to green-ink-on-cream for the features band, and FIG-numbered
sections. Bevan carries the claim, JetBrains Mono the stencil labels and
commands, Archivo the body.

Fonts are self-hosted in `public/fonts` (latin subsets pulled from Google
Fonts). The `↗` and `◂` marks are drawn as SVG, not typed — they fall outside
the latin subset and would otherwise drop to a system face.

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

## The version chip

The `v0.3.1` in the masthead is resolved at build time from the GitHub releases
API (`src/lib/version.ts`), with a hardcoded fallback for when the API is
unreachable in CI. Pages only rebuilds on a push here, so cutting a bushel
release does not refresh it on its own — redeploy the site to pick it up.

## The social card

`public/og.png` is a hand-rendered 1200×630 card. It is a committed asset, not
generated at build; regenerate it by hand if the claim or palette changes.

Planned on the [bushel.sh wayfinder map](https://github.com/frankieramirez/bushel/issues/31).
