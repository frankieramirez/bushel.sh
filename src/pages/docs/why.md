---
title: Why
description: Why bushel is a TUI for Apple Containers, why it manages rather than launches, why one rail at every size, and why it moves.
lede: The arguments behind the shape — a manager not a launcher, one rail, and motion with rules.
---

Apple's `container` CLI is good at the thing a CLI is good at: doing one clearly
named operation to one clearly named thing. It is worse at the loop that follows.
Watching four containers means `container ls -a`, reading an id off the table,
`container logs <id>`, losing it, running `ls` again. The information you want is
never on screen at the same time as the thing you want to do to it.

bushel is that loop, held open. It wraps the same CLI as a subprocess — it never
links Apple's Containerization framework — so nothing it shows you is a second
source of truth, and nothing it runs is a command you could not have typed.

## A manager, not a launcher

Containers are born on the command line and managed in bushel. There is no
`run` or `create` dialog, and that is a decision rather than a gap.

A creation dialog is a second CLI, and a worse one. Image reference, tag, name,
ports, mounts, environment, entrypoint, resource limits — reproducing that as
form fields means either a form nobody can fill or a form that quietly cannot
express what `container run` can. Meanwhile the part that actually repeats —
watching, reading logs, stopping something, cleaning up after it — is the part
no CLI makes pleasant. bushel takes that half and leaves the other alone.

The same instinct sets the rest of the boundary. No image building, no registry
login, no networks pane, no compose emulation, and no `container system stop`,
which is a kill-every-container footgun one keystroke away from something
harmless. Prune is the only bulk operation, because the CLI already implements
prune and it is the bulk operation people actually want.

## The command, before it runs

Delete, prune and kill each show the exact `container …` line in their
confirmation, and nothing destructive runs without one.

Partly this is the obvious safety argument: a confirmation that says *are you
sure* tells you nothing you did not already know, while one that says
`container delete api-worker` tells you which container you actually have
selected. Partly it is that a tool wrapping a CLI should teach it. After a week
of confirmations you know the subcommands, and the day something goes wrong at
three in the morning over SSH you can do it by hand.

Actions that fail write the full stderr to the [message log](/docs/troubleshooting), behind
the one-line gist in the status bar. Nothing is swallowed.

## One rail, at every size

The rail is the column holding all three panes — containers, images, volumes.
Inactive panes collapse to a name or a count; the active one takes the space
that is left.

Version 0.1 did the conventional thing instead: one pane at a time, split 45/55
against the detail pane. Daily use produced two complaints that turned out to be
the same complaint. A 60-column detail pane makes logs unreadable. A
200-column terminal spends most of its width on container names nobody needs
that much room for.

The obvious fix is a mode split — tabs when the terminal is small, a rail when
it is large. bushel rejects it, because it means two interaction models to learn
and a width at which the tool you are using changes into a different tool. So
the rail is always the rail, and the only thing size decides is where it sits:
beside the detail pane at 80 body columns or more, above it when narrower. It
never grows past 36 columns wide. Spare width belongs to logs.

`1`, `2` and `3` expand a pane rather than replacing the others, and zoom
fullscreens the active panel's table rather than the whole rail. At 22 rows or
60 columns and below bushel starts shedding chrome — table headers, the tab
row, the status cluster — rather than refusing to draw.

## Motion, with rules

Terminal UIs are usually static, and the ones in this niche all are. bushel
treats motion as a baseline feature: the splash dissolving into the layout, a
pane switch sliding, the action menu arriving as a bottom sheet, toasts, focus
glow, eased scrolling, a spinner on the poll tick.

The rules matter more than the list. Every animation is 150 milliseconds or
less, interruptible by input, and never delays data display or input handling.
The splash is not an intro — it plays only while the startup probes are running,
which is time you were spending anyway, and any key skips it. `--reduced-motion`
and a config option turn all of it off.

Those constraints are the contract that stops motion becoming the first thing
you disable. Any future animation that cannot meet them does not ship.

## Polling, and saying so

Apple Containers has no event API, so a periodic poll is the only refresh model
available. bushel is honest about what that costs. When three consecutive polls
return output it cannot parse, it keeps the last good list on screen and turns
on a banner saying the rows are stale, rather than blanking the list or showing
fresh-looking lies. When the `container` binary is missing entirely, the empty
rail is the accurate answer, and the reason is in the message log.

The same reasoning keeps telemetry small. CPU and memory sparklines with network
and disk rates, sampled on the poll tick, attached to the selected container.
No history worth configuring, no cadence setting, no overview screen. bushel is
not a monitoring product and stops before pretending to be one.

## Where the arguments were had

bushel's design was worked out in the open, one decision at a time, on GitHub:
the [v0.1 map](https://github.com/frankieramirez/bushel/issues/1) and the
[responsive visual UI map](https://github.com/frankieramirez/bushel/issues/14).
The two decisions above that outlived their tickets are written up as ADRs —
[motion-first](https://github.com/frankieramirez/bushel/blob/main/docs/adr/0001-motion-first-tui.md)
and [the unified
rail](https://github.com/frankieramirez/bushel/blob/main/docs/adr/0002-unified-rail.md).

bushel is MIT licensed, which was also a choice: the deepest tool in this niche
is GPL, and that is a real constraint on who can borrow from it.
