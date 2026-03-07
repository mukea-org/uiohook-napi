# Vendored uiohook

This repository vendors the upstream `libuiohook` code directly under [`uiohook`](./uiohook).

## Current upstream base

- Upstream project: `https://github.com/kwhat/libuiohook`
- Tracking mode: latest upstream `master`
- Last imported upstream commit: `6b79eff65e144325d1103cc422cc1fea8246ab21`

## Local policy

- The vendored `uiohook` code is maintained directly in this repository.
- New work should start from the current vendored upstream snapshot, not from a historical patch set.
- Local fixes are committed as normal repository changes. There is no submodule and no patch file workflow.
- If upstream code is referenced again in the future, treat it as a manual import decision: update the commit reference above and review the diff in `uiohook/` together with the root `CMakeLists.txt` and the native glue code under `src/lib/`.
