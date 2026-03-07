# @mukea/uiohook-napi

[![npm version](https://img.shields.io/npm/v/@mukea/uiohook-napi/latest?color=CC3534&label=@mukea/uiohook-napi&logo=npm&labelColor=212121)](https://www.npmjs.com/package/@mukea/uiohook-napi)
[![GitHub repository](https://img.shields.io/badge/GitHub-mukea--org/uiohook--napi-blue?logo=github)](https://github.com/mukea-org/uiohook-napi)

N-API bindings for `libuiohook`.

This repository now vendors the `libuiohook` source directly. It no longer relies on a git submodule or a separate patch file during normal development and release flows.

## Runtime model

Consumers are expected to install prebuilt native binaries from npm. The package no longer performs install-time native compilation.

Maintainers build native artifacts explicitly:

```powershell
pnpm install --ignore-scripts
pnpm build-ts
pnpm native:build
pnpm prebuild
```

The native build is now CMake-driven through `cmake-js`. See [development.md](./docs/development.md) for local setup and [UPSTREAM.md](./UPSTREAM.md) for vendored `libuiohook` maintenance rules.

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
