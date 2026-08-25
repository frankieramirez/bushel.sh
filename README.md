# bushel.sh

The website for [bushel](https://github.com/frankieramirez/bushel), a terminal
UI for managing Apple Containers.

Astro, static output, deployed on Cloudflare Pages (build: `npm run build`,
output: `dist`). `public/_redirects` sends `/install` to the canonical
GitHub-releases installer — the domain never hosts a copy of the script.

```sh
npm install
npm run dev
```

Planned on the [bushel.sh wayfinder map](https://github.com/frankieramirez/bushel/issues/31).
