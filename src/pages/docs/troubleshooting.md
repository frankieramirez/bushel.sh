---
title: Troubleshooting
description: What to do when bushel will not start, shows nothing, or refuses an action.
lede: Symptoms you can actually see on screen, and what each one means.
---

Press `m` first. The message log holds the full stderr of every command that
failed, alongside the exact `container …` line that ran. Every toast that
flashed past in the status bar is in there too, so nothing is lost by missing
one. It keeps the last 1,000 entries and it is available on the service-down
screen as well, which is usually where you want it.

## bushel will not start

### `bushel: command not found`

The shell installer put the binary in `$CARGO_HOME/bin`, falling back to
`~/.cargo/bin` when `CARGO_HOME` is unset, and appended that directory to your
shell rc files. Your current shell was started before that happened. Open a new
one, or source the env script the installer wrote:

```sh
source "$HOME/.cargo/env"
```

If you installed with `BUSHEL_NO_MODIFY_PATH=1`, your rc files were left alone
on purpose and putting the directory on `PATH` is your job. Same if you pointed
`BUSHEL_INSTALL_DIR` somewhere the shell does not already look.

Homebrew installs land wherever `brew --prefix` says, which is already on `PATH`
for a normal Homebrew setup.

### `there isn't a download for your platform x86_64-apple-darwin`

The installer only publishes an `aarch64-apple-darwin` archive. bushel is built
for Apple silicon because Apple's `container` runtime is, so an Intel Mac has
nothing to run either way.

## bushel starts but shows nothing

### The whole screen says the container system service is not running

bushel replaces the UI with a red-bordered takeover when Apple's container
service is unreachable. Press `s` and it runs:

```sh
container system start --enable-kernel-install
```

Output from that command streams into the takeover as it goes. The first run on
a machine installs a kernel and can sit there for a while, so give it longer
than feels reasonable before deciding it is stuck. bushel re-probes the service
every two seconds and drops back to the normal view by itself once the service
answers, with a `container system service is up` toast.

You can also start the service yourself from another terminal, and bushel will
notice.

The `--enable-kernel-install` flag is doing real work there. Without it, a bare
`container system start` stops on an interactive prompt that a TUI has no way to
answer.

### Every pane reads 0 and nothing on screen explains why

Look at the right-hand end of the status bar. If it reads `container ?` instead
of a version number, bushel could not run the `container` binary at all, and
the empty panes are the result of nothing having answered.

Press `m` and you will see the real reason:

```
poll failed: container ls -a --format json: No such file or directory (os error 2)
version check failed: container --version: No such file or directory (os error 2)
```

bushel shells out to `container` and finds it on `PATH`, so this means the CLI
is missing from the `PATH` bushel inherited. Check with:

```sh
which container
```

Apple's installer puts it in `/usr/local/bin`. Launching bushel from an editor
or a task runner with a trimmed environment is the usual way to lose it.

The service dot next to that version stays green here, which is misleading. It
only turns red on the service-down screen, and bushel never gets far enough to
reach that screen when the binary itself is absent.

## Banners along the top

### `container CLI 1.3.0 detected — bushel is tested against 1.2.x`

bushel parses `container --version` at startup and compares the major and minor
against the range its fixtures were captured on, currently `1.2.x`. Any patch
release inside that minor counts as tested. A version it cannot parse counts as
untested.

Nothing about it is blocked: the `container` CLI only promises stable output
within a patch series, so a different minor may have moved the JSON that bushel
reads.
Press `b` to dismiss the banner for the session. If output really has moved,
the degraded banner below is what you will see next.

### `polls failing to parse — showing last good state`

Three consecutive container polls returned stdout that would not deserialise.
bushel holds the last good list on screen instead of blanking it, and turns the
banner on so you know the rows are stale.

`m` shows what came back, prefixed `poll parse failure:`. In practice this is a
`container` version whose JSON no longer matches, so it tends to arrive
alongside the version banner. Worth an issue if you hit it, with the offending
output pasted in.

Image, volume and network polls that fail never trip this banner. They only write to the
message log.

## An action failed

Every failed action writes the command and its full stderr to the message log,
then puts a one-line gist in the status bar. Read the gist, then press `m` for
the rest.

Gists worth recognising:

- **`<id>: already gone`**. The row was stale, and a poll had not caught up with
  something deleted elsewhere. Harmless.
- **A long line ending `is running and can not be deleted`**. For anything the
  CLI refuses on its own terms bushel forwards the CLI's first stderr line
  verbatim, so expect the full `internalError: … (cause: "invalidState: …")`
  wrapping. Stop the container first, or press `K` to kill it. A volume still
  attached to a container reports itself as in use the same way.
- **`timed out`**. A read passed its 10-second deadline. Actions that change
  things carry no deadline at all, so a slow `image pull` or `prune` is free to
  take minutes.
- **`bushel bug: invalid command line (see message log)`**. The `container` CLI
  rejected the arguments bushel built, exit 64. That one is bushel's fault,
  so please file it with the log line.
- **`unexpected CLI output (see message log)`**. The command worked and its
  output would not parse.

Destructive actions confirm first and print the exact command in the dialog. If
a command in that dialog looks wrong, it is the command that will run, verbatim.

### `e` drops straight back with `exec exited 1`

`e` suspends the UI and runs `container exec -it <id> /bin/sh`. Images built on
`distroless` or `scratch` have no `/bin/sh`, so the exec fails immediately and
bushel restores itself. Use the terminal directly if the image needs a different
shell path.

### A volume cannot be deleted

bushel checks whether the volume is attached to a container before opening the
delete confirmation. If it is, the toast names the containers using it and `m`
shows the reason. Stopped containers can still hold a volume. Remove those
containers when you no longer need them, then retry. The CLI may also refuse a
delete if a volume became attached after bushel's last poll.

### A new image tag or volume name is rejected

An empty tag destination keeps the input open with an `enter a new reference`
toast. An empty volume name closes the prompt without creating anything.
Other naming errors come from the CLI after confirmation; press `m` for the
full error, then open the prompt again to retry. Volume creation accepts a name
only; mount options and container attachment belong in the CLI.
[Using bushel](/docs/usage) shows the pull, tag and volume workflows.

### Network action keys do nothing

The Networks pane supports browsing, filtering and inspection. Create or
delete networks with Apple's CLI. Container action keys do not apply there.

## The UI looks wrong

### Boxes, question marks, or missing icons

Your terminal font has no glyph for the Unicode bushel draws. Run with:

```sh
bushel --ascii
```

That swaps every icon and spinner for ASCII. Colours looking flat is a separate
thing: bushel only uses the full 24-bit palette when `COLORTERM` contains
`truecolor` or `24bit`, and steps down to the 256-colour palette otherwise.

### The terminal is smaller than the layout wants

At 22 rows or fewer, or 60 columns or fewer, the header shrinks to one row while
the table headers, the detail tab row, the status cluster and the `l`/`i` jumps
in the action menu all drop away to buy back space. In rail mode, narrower than
80 body columns, the rail stacks above the detail pane instead of sitting beside
it. Table mode always puts the active table above the detail pane. Press `,` to
change the layout, or launch with `bushel --layout table`.

Smaller again and bushel still draws. The rail and the detail pane split
whatever rows are left, and once the rail is down to fewer than three rows the
collapsed panes give way so the active one keeps them. Versions before 0.3.2 panicked here
instead ([#52](https://github.com/frankieramirez/bushel/issues/52)), so upgrade
if you see `min > max` in a crash.

### Motion is distracting, or the terminal cannot keep up

```sh
bushel --reduced-motion
```

That kills the splash and every transition and ambient effect, leaving bushel
to repaint only when something actually changes. `--no-splash` skips just
the opening animation.

## Settings that do nothing

bushel reads `~/.config/bushel/config.toml`, which holds four options:

```toml
no_splash = false
reduced_motion = false
ascii = false
layout = "rail"
```

If `BUSHEL_CONFIG_DIR` is set, the file is `config.toml` in that directory
instead. The settings panel (`,`) shows the path it saves to; the
[config reference](/docs/config) explains the directory override.

A key it does not recognise is ignored in silence. `reduce_motion` instead of
`reduced_motion` produces no warning and no effect, so check the spelling
against the block above when a setting seems dead. The
[config reference](/docs/config) is generated from bushel's own source and is
the authority on the names.

A value of the wrong type is louder. bushel prints one line and falls back to
defaults for the whole file:

```
bushel: ignoring invalid config at /Users/you/.config/bushel/config.toml: TOML parse error at line 1, column 13
```

That prints before the UI takes over the screen, so it is easy to miss. Running
`bushel` and quitting immediately with `q` will leave it visible in your
scrollback.

The boolean flags only switch their settings on at startup. To turn one off,
edit the file or change it in the settings panel. `--layout rail` and
`--layout table` override the file's layout for that run. The panel applies
changes immediately and saves the setting you changed for future launches.

If you see `could not save config`, the current session still uses the change,
but bushel could not write it to disk. Check permissions on the config directory
and any `BUSHEL_CONFIG_DIR` override, then try again.

## `bushel update` refuses to update

`bushel update` works out how bushel was installed by looking at its own path,
then hands the work to whatever put it there.

- **Homebrew**: runs `brew upgrade bushel` for you.
- **Nix**: refuses, because the store is read-only. Update the flake or channel
  that provides it and rebuild.
- **cargo**: prints the `cargo install --git … --force` line to run. cargo
  cannot tell a new version from the current one without a full rebuild, so
  bushel will not burn the minutes on your behalf.
- **`no install receipt found`**: the binary was placed by hand, or the receipt
  the shell installer writes has been deleted. Reinstall with the installer from
  the latest release, or upgrade with whatever put the binary there.

## Reporting a bug

Open an issue on
[GitHub](https://github.com/frankieramirez/bushel/issues). Paste the message log
(`m`), which already contains the failing command and its stderr. The output of
`container --version` and your terminal dimensions are worth adding, since both
change what bushel does.
