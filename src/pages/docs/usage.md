---
title: Using bushel
description: Browse and manage Apple Containers, images, volumes and networks from bushel.
lede: A practical tour of the four panes and the actions available in each one.
---

bushel reads the resources already managed by Apple's `container` CLI. Start it
with:

```sh
bushel
```

The main screen has four panes. Press `1` for containers, `2` for images, `3`
for volumes and `4` for networks. `tab` cycles through them. In the default
rail layout all four stay visible; the table layout gives the selected pane the
full width. Press `,` to change the layout in the settings panel, or start with
`bushel --layout rail` or `bushel --layout table`. See [`Config`](/docs/config)
for the file and flags.

Use `j` and `k` or the arrow keys to move through a list. Press `enter` to move
focus to its detail pane, and `esc` to go back. `/` filters the focused list.
Press `?` for the keymap overlay. The [Keys page](/docs/keys) also covers dialog
controls.

## Containers

Select a container in pane `1`. The detail area has Logs and Inspect tabs. `l`
opens Logs and `i` opens Inspect. Logs show a backlog of the most recent 200
lines. Following is on by default; `F` toggles it while the Logs tab is active.
With detail focused, scroll backward with `k` or `g` to stop following.
PageUp scrolls back from either focus. `w` switches
between wrapped and truncated log lines. Press `e` on a running container to
open an interactive `/bin/sh` session.

The action menu (`space`) offers actions that apply to the selected container.
The direct action keys are `s` for start or stop, `r` for restart, `K` for kill,
`d` for delete, `P` for pruning stopped containers, and `e` for an exec shell:

- Start a stopped container, stop a running one, or restart it.
- Kill a running container.
- Delete the selected container.
- Prune stopped containers.
- Open a shell with Exec, or switch to Logs and Inspect.

Start, stop and restart run immediately. Kill, delete and prune show the exact
`container ...` command and wait for confirmation. Press `f` to zoom the focused
side and `m` to open the message log.

## Images

Pane `2` lists local images. Its actions let you:

- Pull an image by entering a reference such as `alpine:latest`.
- Tag the selected image with a new reference.
- Delete the selected image.
- Prune unused images.

Press `u` to pull an image and `t` to tag the selected image. The same actions
are available from the action menu (`space`). A pull normalizes a reference
without a tag by adding `:latest`, so entering `alpine` runs:

```text
container image pull alpine:latest --progress plain
```

To pull it, focus the images pane, press `u`, type `alpine`, and press `enter`.
The pull reference must be non-empty; bushel trims the entered text before
starting it. Pull output is shown in the images detail area while the pull runs.

To tag an image, select it, press `t`, enter a non-empty destination reference,
and press `enter`. Bushel then previews the command and asks for confirmation:

```text
container image tag alpine:latest local/alpine:test
```

Tagging, deletion and pruning ask for confirmation. Pull streams plain progress
in the images detail area. An image still used by a container may be rejected by
the underlying `container` CLI.

## Volumes

Pane `3` lists volumes and shows which containers use each one. `c` opens the
name prompt for creating a volume. Enter a non-empty name such as `cache`, then
press `enter`. Volume creation accepts only that name, with no attachment or
mount options, and previews:

```text
container volume create cache
```

Select a volume and press `d` to delete it, or `P` to prune unreferenced
volumes. Both operations show the command before confirmation.

Deletion is blocked when bushel can see that a volume is in use by a container.
Pruning and creation also ask for confirmation; the name prompt is submitted
with `enter` and cancelled with `esc`.

## Networks

Pane `4` lists networks with their mode, IPv4 subnet and builtin marker. The
detail view shows attached container IDs and their IPv4 addresses when present;
selecting a network opens its read-only Inspect detail. Networks currently have
no create, delete or prune actions in bushel.

## Confirmations and settings

Destructive actions display the exact command before they run. Press `y` to
confirm, or `n` or `esc` to cancel. Inputs such as image tags and volume names
use `enter` to submit and `esc` to cancel.

Press `,` to open the settings panel. Changes to the layout and the other
settings are saved to `config.toml`; see [`Config`](/docs/config) for the file
and command-line flags.
