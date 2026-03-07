# @mukea/uiohook-napi

[![npm version](https://img.shields.io/npm/v/@mukea/uiohook-napi/latest?color=CC3534&label=@mukea/uiohook-napi&logo=npm&labelColor=212121)](https://www.npmjs.com/package/@mukea/uiohook-napi)
[![GitHub repository](https://img.shields.io/badge/GitHub-mukea--org/uiohook--napi-blue?logo=github)](https://github.com/mukea-org/uiohook-napi)

N-API bindings for `uiohook`.

This repository now vendors the `uiohook` source directly in-tree. It no longer relies on a git submodule or a separate patch file during normal development and release flows.

## Runtime model

Consumers are expected to install a published registry package that already contains `dist/` and `prebuilds/`. The package no longer performs install-time native compilation.

## Installation

Supported registry installs:

```bash
npm install @mukea/uiohook-napi
```

For GitHub Packages, use the GitHub owner scope and configure the registry first:

```ini
@mukea-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
npm install @mukea-org/uiohook-napi
```

Unsupported install method:

```bash
npm install github:mukea-org/uiohook-napi#v2.0.0-alpha3
```

Git URL installs fetch the repository snapshot at that tag, not the published registry tarball. That snapshot does not include generated `dist/` or bundled `prebuilds/`, so it is not a supported consumer path.

For day-to-day work:

```powershell
pnpm install --ignore-scripts
pnpm build
pnpm dev
```

`pnpm build` produces the published JS output under `dist/`. `pnpm dev` builds the local native addon and starts the interactive hook listener for development and testing on Windows, Linux, and macOS. The native build is CMake-driven through `cmake-js`. See [development.md](./docs/development.md) for local setup and [UPSTREAM.md](./UPSTREAM.md) for vendored `uiohook` maintenance rules.

## Usage example

```typescript
import { uIOhook, UiohookKey } from '@mukea/uiohook-napi'

uIOhook.on('keydown', (e) => {
  if (e.keycode === UiohookKey.Q) {
    console.log('Hello!')
  }

  if (e.keycode === UiohookKey.Escape) {
    process.exit(0)
  }
})

uIOhook.start()
```

## API

```typescript
interface UiohookNapi {
  on(event: 'input', listener: (e: UiohookKeyboardEvent | UiohookMouseEvent | UiohookWheelEvent) => void): this
  on(event: 'keypress', listener: (e: UiohookKeyboardEvent) => void): this
  on(event: 'keydown', listener: (e: UiohookKeyboardEvent) => void): this
  on(event: 'keyup', listener: (e: UiohookKeyboardEvent) => void): this
  on(event: 'mousedown', listener: (e: UiohookMouseEvent) => void): this
  on(event: 'mouseup', listener: (e: UiohookMouseEvent) => void): this
  on(event: 'mousemove', listener: (e: UiohookMouseEvent) => void): this
  on(event: 'click', listener: (e: UiohookMouseEvent) => void): this
  on(event: 'wheel', listener: (e: UiohookWheelEvent) => void): this
  keyTap(key: keycode, modifiers?: keycode[]): void
  keyToggle(key: keycode, toggle: 'down' | 'up'): void
}
```
