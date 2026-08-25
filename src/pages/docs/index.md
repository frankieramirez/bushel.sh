---
title: Overview
description: Documentation for bushel, a terminal UI for the containers, images and volumes already on your Mac.
---

The [keymap](/docs/keys) and the [config reference](/docs/config) are generated
from bushel's own source, and [troubleshooting](/docs/troubleshooting) covers
what to do when something looks broken.

Install and the why behind the design are still being written. Until they land,
the [README](https://github.com/frankieramirez/bushel#readme) covers
requirements and every install method. Installing takes one line:

```sh
curl -LsSf https://bushel.sh/install | sh
```

bushel needs macOS 26 on Apple silicon, and Apple's `container` CLI.

## What is here

The contents list has the six pages this section will hold. Install and why are
the two still to come.

### Reporting something broken

Open an issue on
[GitHub](https://github.com/frankieramirez/bushel/issues). The message log
inside bushel (`m`) keeps the full stderr of anything that failed, which is the
most useful thing to paste.
