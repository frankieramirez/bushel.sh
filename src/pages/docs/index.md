---
title: Overview
description: Documentation for bushel, a terminal UI for the containers, images and volumes already on your Mac.
lede: What bushel is, and where to go next.
---

bushel is a terminal UI for [Apple
Containers](https://github.com/apple/container). It manages the containers,
images and volumes already on your Mac. All three sit on one rail with live
telemetry on whatever is selected, and anything destructive shows you the exact
`container …` command before it runs.

It wraps Apple's `container` CLI as a subprocess and manages what already
exists. Containers are born on the command line; bushel is the part that comes
after. [Why it is shaped that way](/docs/why) is its own page.

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
  upgrades.
- **[Keys](/docs/keys)**: the full keymap, generated from the cheatsheet bushel
  ships. Press `?` for the same list without leaving the terminal.
- **[Config](/docs/config)**: the three options in
  `~/.config/bushel/config.toml` and the flags that override them.
- **[Troubleshooting](/docs/troubleshooting)**: what to do when bushel will not
  start, shows nothing, or refuses an action.
- **[Why](/docs/why)**: the arguments behind the shape, from where the scope
  stops to the rules motion has to meet.

The keys and config pages are generated from bushel's own source on every
release, so neither can drift from the binary you are running.

## Reporting something broken

Open an issue on
[GitHub](https://github.com/frankieramirez/bushel/issues). The message log
inside bushel (`m`) keeps the full stderr of anything that failed, which is the
most useful thing to paste.
