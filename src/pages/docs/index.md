---
title: Overview
description: Documentation for bushel, a terminal UI for Apple containers, images, volumes and networks.
lede: What bushel is, and where to go next.
---

bushel is a terminal UI for [Apple
Containers](https://github.com/apple/container). Browse containers, images,
volumes and networks in four panes, with live telemetry for the selected
container. Choose a rail beside the detail pane or a full-width table above it.
Delete, prune and kill show the exact `container …` command before you confirm.

It wraps Apple's `container` CLI as a subprocess. Create containers on the
command line, then use bushel to manage them. You can also pull and tag images,
create named volumes, and inspect existing networks. [Why it is shaped that
way](/docs/why) explains the scope.

## Requirements

- macOS 26 on Apple silicon.
- Apple's `container` CLI, tested against `1.2.x`. Other versions raise a
  dismissable banner and still run.

Installing takes one line:

```sh
curl -LsSf https://bushel.sh/install | sh
```

Then run `bushel`. [Homebrew, cargo, and the environment
knobs](/docs/install) are on the install page, along with what `bushel update`
does for each method.

## Where to go next

- **[Install](/docs/install)**: every install method, and how each one
  upgrades, plus shell completions and the man page.
- **[Using bushel](/docs/usage)**: navigate the panes, read logs, and manage
  containers, images and volumes. Networks are available for inspection.
- **[Keys](/docs/keys)**: the full keymap, generated from the cheatsheet bushel
  ships. Press `?` for the same list without leaving the terminal.
- **[Config](/docs/config)**: layouts, the settings panel, and the four options
  in `~/.config/bushel/config.toml`, including how flags override them.
- **[Troubleshooting](/docs/troubleshooting)**: what to do when bushel will not
  start, shows nothing, or refuses an action.
- **[Why](/docs/why)**: the arguments behind the shape, from where the scope
  stops to the rules motion has to meet.

The key and config tables come from the latest release's generated reference
at site build time. Each page names that version; compare it with
`bushel --version` if you run an older binary. If release data cannot be fetched,
the site uses its bundled reference and displays that copy's version.

## Reporting something broken

Open an issue on
[GitHub](https://github.com/frankieramirez/bushel/issues). The message log
inside bushel (`m`) keeps the full stderr of anything that failed, which is the
most useful thing to paste.
