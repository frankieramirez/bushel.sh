---
title: Why
description: Why bushel is a TUI for Apple Containers, where its scope stops, why one rail at every size, and why it moves.
lede: The arguments behind the shape, from where the scope stops to the rules motion has to meet.
---

Apple's `container` CLI does what a CLI does well: one clearly named operation
to one clearly named thing. The loop that follows is where it gets tiring.
Watching four containers means `container ls -a`, reading an id off the table,
`container logs <id>`, losing it, running `ls` again. The information you want is
never on screen at the same time as the thing you want to do to it.

bushel is that loop, held open. It wraps the same CLI as a subprocess and never
links Apple's Containerization framework, so everything it shows you comes from
the same place your own commands would, and everything it runs is a command you
could have typed yourself.

## Where the scope stops

Containers are born on the command line and managed in bushel. There is no
`run` or `create` dialog, on purpose.

A creation dialog is a second CLI, and a worse one. Image reference, tag, name,
ports, mounts, environment, entrypoint, resource limits: reproducing that as
form fields gives you either a form nobody can fill or a form that quietly
cannot express what `container run` can. Meanwhile the part that actually
repeats, watching and reading logs and stopping something and cleaning up after
it, is the part no CLI makes pleasant. bushel takes that half and leaves the
other alone.

The same instinct sets the rest of the boundary. Image building, registry login,
a networks pane and compose emulation are all out. So is `container system
stop`, a kill-every-container footgun one keystroke away from something
harmless. Prune is the only bulk operation, because the CLI already implements
prune and it is the bulk operation people actually want.

## The command, before it runs

Delete, prune and kill each show the exact `container …` line in their
confirmation, and nothing destructive runs without one.

Partly this is the obvious safety argument: a confirmation that says *are you
sure* adds nothing you did not already know, while one that says
`container delete api-worker` shows you which container you actually have
selected. Partly it is that a tool wrapping a CLI should teach it. After a week
of confirmations you know the subcommands, and the day something goes wrong at
three in the morning over SSH you can do it by hand.

Actions that fail write the full stderr to the [message
log](/docs/troubleshooting), behind the one-line gist in the status bar, so
nothing gets swallowed.

## One rail, at every size

The rail is the column holding all three panes: containers, images, volumes.
Inactive panes collapse to a name or a count; the active one takes the space
that is left.

Version 0.1 did the conventional thing instead: one pane at a time, split 45/55
against the detail pane. Daily use turned up two complaints that were really the
same complaint. Logs are unreadable in a 60-column detail pane, and on a
200-column terminal most of that width goes to container names nobody needs that
much room for.

The obvious fix is a mode split: tabs below some width, a rail above it. bushel
rejects that, because it means two interaction models to learn and a width at
which the tool you are using turns into a different tool. So the rail is always
the rail, and the only thing size decides is where it sits: beside the detail
pane at 80 body columns or more, above it when narrower. It never grows past 36
columns wide, since spare width is worth more to logs.

`1`, `2` and `3` expand a pane and leave the others in place, and zoom
fullscreens the active panel's table on its own. At 22 rows or 60 columns and
below bushel keeps drawing and starts shedding chrome instead: table headers,
the tab row, the status cluster.

## Motion, with rules

Terminal UIs are usually static, and the ones in this niche all are. bushel
treats motion as a baseline feature: the splash dissolving into the layout, a
pane switch sliding, the action menu arriving as a bottom sheet, toasts, focus
glow, eased scrolling, a spinner on the poll tick.

Every animation caps at 150 milliseconds, yields the moment you press a key, and
never delays data display or input handling. The splash plays only while the
startup probes are running, which is time you were spending anyway, and any key
skips it. `--reduced-motion` and a config option turn all of it off.

Those are the contract that keeps motion from becoming the first thing you
disable, and any future animation that cannot meet them does not ship.

## Polling, and saying so

Apple Containers has no event API, so a periodic poll is the only refresh model
available. bushel is honest about what that costs. Three consecutive polls
returning output it cannot parse will keep the last good list on screen and turn
on a banner saying the rows are stale, which beats blanking the list or showing
fresh-looking lies. If the `container` binary is missing entirely, an empty rail
is the accurate answer, and the reason is in the message log.

The same reasoning keeps telemetry small: CPU and memory sparklines with network
and disk rates, sampled on the poll tick, attached to the selected container.
Nothing about it is configurable, and there is no stored history or overview
screen behind it. bushel is not a monitoring product and stops before pretending
to be one.

## Where the arguments were had

bushel's design was worked out in the open, one decision at a time, on GitHub:
the [v0.1 map](https://github.com/frankieramirez/bushel/issues/1) and the
[responsive visual UI map](https://github.com/frankieramirez/bushel/issues/14).
The two decisions above that outlived their tickets are written up as ADRs:
[motion-first](https://github.com/frankieramirez/bushel/blob/main/docs/adr/0001-motion-first-tui.md)
and [the unified
rail](https://github.com/frankieramirez/bushel/blob/main/docs/adr/0002-unified-rail.md).

bushel is MIT licensed, which was also a choice: the deepest tool in this niche
is GPL, and that is a real constraint on who can borrow from it.
