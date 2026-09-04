---
title: Install
description: Every way to install bushel (Homebrew, the shell installer, cargo, or the archive by hand), plus the environment knobs and how each install upgrades.
lede: Four ways in, and the upgrade path that comes with each one.
---

bushel is a single binary. The fastest way to get it:

```sh
curl -LsSf https://bushel.sh/install | sh
```

Everything below is the same binary arriving by a different route. Which route
you take decides one thing later: what `bushel update` does when a new release
lands.

## What bushel needs

**macOS 26 on Apple silicon.** The only archive published is
`aarch64-apple-darwin`, and an Intel Mac has nothing to run either way, since
Apple's container runtime is Apple silicon only.

**Apple's [`container`](https://github.com/apple/container) CLI.** bushel shells
out to it and finds it on `PATH`; Apple's installer puts it in `/usr/local/bin`.
Versions are checked at startup against `1.2.x`, the range bushel's fixtures
were captured on. Anything else raises a dismissable banner and still runs. The
CLI only promises stable output within a patch series, so a different minor may
have moved the JSON bushel reads.

## Homebrew

```sh
brew install frankieramirez/tap/bushel
```

The release workflow publishes the formula to
[frankieramirez/homebrew-tap](https://github.com/frankieramirez/homebrew-tap).

## Shell installer

```sh
curl -LsSf https://bushel.sh/install | sh
```

This needs neither Homebrew nor a Rust toolchain. `bushel.sh/install` is a 302
to `bushel-installer.sh` attached to the latest GitHub release. This domain
never hosts a copy of the script, so what you run is always the checksummed
asset sitting next to the archive it installs.

### Where it puts things

- The binary in `$CARGO_HOME/bin`, falling back to `~/.cargo/bin` when
  `CARGO_HOME` is unset.
- An `env` script beside it, at `$CARGO_HOME/env`.
- A line sourcing that script appended to your shell rc files: `.profile`,
  `.bashrc`, `.bash_profile` and `.bash_login` for bash, `.zshrc` and `.zshenv`
  for zsh, `~/.config/fish/conf.d/bushel.env.fish` for fish.
- An install receipt at `~/.config/bushel/bushel-receipt.json`, honouring
  `XDG_CONFIG_HOME`. This is the file `bushel update` reads to know it may
  replace the binary in place.

Your current shell was started before any of that happened, so open a new one or
source the env script:

```sh
source "$HOME/.cargo/env"
```

### `BUSHEL_INSTALL_DIR`

Installs somewhere else. It names a **prefix** in the `$CARGO_HOME` layout, so
the binary goes to `$BUSHEL_INSTALL_DIR/bin` and the env script to
`$BUSHEL_INSTALL_DIR/env`.

```sh
curl -LsSf https://bushel.sh/install | BUSHEL_INSTALL_DIR="$HOME/.local" sh
```

That example puts bushel in `~/.local/bin`.

### `BUSHEL_NO_MODIFY_PATH`

Set it to `1` and your rc files are left alone. Getting the install directory
onto `PATH` is then your job, which is worth remembering when `bushel: command
not found` turns up later.

```sh
curl -LsSf https://bushel.sh/install | BUSHEL_NO_MODIFY_PATH=1 sh
```

The installer still accepts a `--no-modify-path` flag, but it is deprecated and
says so; the environment variable is the supported form.

### Installer flags

Arguments go after `-s --`:

```sh
curl -LsSf https://bushel.sh/install | sh -s -- --help
```

`-v` for verbose output, `-q` to silence progress, `-h` for that help text.

### Skipping the redirect, or pinning a version

The hop through `bushel.sh` is a convenience. Fetch the asset directly to cut it
out, and to pin the hardened curl flags while you are there:

```sh
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/frankieramirez/bushel/releases/latest/download/bushel-installer.sh | sh
```

Each installer is built for its own release and installs exactly that version,
so pinning is a matter of naming the tag instead of `latest`:

```sh
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/frankieramirez/bushel/releases/download/v0.3.4/bushel-installer.sh | sh
```

## From source

```sh
cargo install bushel
```

The [published crate](https://crates.io/crates/bushel) builds locally and needs
a Rust toolchain. The crate declares Rust 1.85 as its minimum; use a current
stable toolchain to satisfy its dependencies.

This install has no receipt. `bushel update` therefore prints a cargo command
instead of replacing the binary itself:

```sh
cargo install --git https://github.com/frankieramirez/bushel --force
```

That command builds the GitHub source. To stay on crates.io releases, run
`cargo install bushel --force` yourself.

To build the current GitHub source directly:

```sh
cargo install --git https://github.com/frankieramirez/bushel
```

## Shell completions and the man page

`bushel --help` lists commands and options without opening the UI.
`bushel --version` prints the installed version.

The release assets include generated completion scripts for Bash, Zsh and Fish,
plus `bushel.1`:

- [`bushel.bash`](https://github.com/frankieramirez/bushel/releases/latest/download/bushel.bash)
- [`bushel.zsh`](https://github.com/frankieramirez/bushel/releases/latest/download/bushel.zsh)
- [`bushel.fish`](https://github.com/frankieramirez/bushel/releases/latest/download/bushel.fish)
- [`bushel.1`](https://github.com/frankieramirez/bushel/releases/latest/download/bushel.1)

Generate completions from your installed binary to match its commands and
flags. The downloaded assets follow the latest release instead.

### Bash

Load completions for the current shell:

```bash
source <(bushel completions bash)
```

To load them in new interactive Bash sessions, add that line to `~/.bashrc`
(and make sure your Bash login profile sources that file).

### Zsh

Save the script in a directory you own:

```zsh
mkdir -p "$HOME/.zfunc"
bushel completions zsh > "$HOME/.zfunc/_bushel"
```

Add the directory to `fpath` in `~/.zshrc`, before any existing `compinit` call.
If your configuration doesn't initialize completions yet, use the whole block:

```zsh
fpath=("$HOME/.zfunc" $fpath)
autoload -Uz compinit
compinit
```

Start a new Zsh session to load it.

### Fish

```fish
mkdir -p "$__fish_config_dir/completions"
bushel completions fish > "$__fish_config_dir/completions/bushel.fish"
```

Fish loads the file when completing `bushel` in a new session.

### Man page

Download the generated man page into a user-owned directory, then read it with
an explicit man path:

```sh
mkdir -p "$HOME/.local/share/man/man1"
curl -LsSf https://github.com/frankieramirez/bushel/releases/latest/download/bushel.1 \
  -o "$HOME/.local/share/man/man1/bushel.1"
man -M "$HOME/.local/share/man" bushel
```

If that directory is already on your man path, `man bushel` is enough.

## The archive, by hand

Every release carries `bushel-aarch64-apple-darwin.tar.xz` with a matching
`.sha256`, plus a combined `sha256.sum` covering every asset. Unpack it and put
the binary anywhere on `PATH`.

Nothing records that you did this, so `bushel update` will say so instead of
guessing.

## Upgrading

```sh
bushel update
```

Every install method owns the binaries it placed, so `update` works out which
one you used, first from where the running binary sits and then from whether a
receipt exists, then hands the work back to it:

- **Shell installer.** Replaces itself in place from the latest GitHub release,
  printing the new version. Already current, and it says
  `bushel 0.3.4 is already up to date` instead.
- **Homebrew.** Refreshes the tap before running `brew upgrade bushel`, even
  when normal Homebrew auto-updates are disabled.
- **cargo.** Prints the command and stops:
  `cargo install --git https://github.com/frankieramirez/bushel --force`. It
  will not run it, because cargo cannot tell a new version from the current one
  without a full rebuild, and burning those minutes on a likely no-op is worse
  than one line of output.
- **Nix.** Refuses. The store is read-only and the derivation is the source of
  truth, so the flake or channel that provides bushel is the thing to update.
- **Anything else.** `no install receipt found`. Upgrade with whatever placed
  the binary, or reinstall with the shell installer.

The shell installer's default prefix is `$CARGO_HOME` too, so the path alone
cannot tell a shell install from `cargo install`. The receipt is what separates
them.

## Uninstall

Homebrew installs come off with `brew uninstall bushel`. For the rest there is
no uninstaller, so remove what the installer wrote:

- The binary, wherever it landed (`which bushel`).
- The receipt, `~/.config/bushel/bushel-receipt.json`.
- The `env` script beside the binary, and the line sourcing it in your rc
  files, but only if nothing else you installed shares that directory.
- Your config, `~/.config/bushel/config.toml`, and the `.launched` marker beside
  it that records a first run has happened. If `BUSHEL_CONFIG_DIR` is set, both
  are in that directory instead. The receipt follows `XDG_CONFIG_HOME`,
  independently of this override.
