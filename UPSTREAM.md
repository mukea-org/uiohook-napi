# Vendored libuiohook

This repository vendors the `libuiohook` source directly under [`libuiohook`](./libuiohook).

## Current upstream base

- Upstream project: `https://github.com/kwhat/libuiohook`
- Tracking mode: latest upstream `master`
- Last imported upstream commit: `6b79eff65e144325d1103cc422cc1fea8246ab21`

## Local policy

- `libuiohook` is maintained directly in this repository.
- New work should start from the current vendored upstream snapshot, not from a historical patch set.
- Local fixes are committed as normal repository changes. There is no submodule and no patch file workflow.
- When importing a newer upstream snapshot, update the commit reference above and review the diff in `libuiohook/` together with the root `CMakeLists.txt` and the native glue code under `src/lib/`.

## Upstream sync

Use:

```powershell
pnpm sync:libuiohook
```

The sync script replaces the working tree contents of `libuiohook/` from an upstream ref. Review the resulting diff before committing.
