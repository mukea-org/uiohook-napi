# Development

## Goals

- Consumers install prebuilt binaries from npm.
- Maintainers compile native code explicitly.
- `libuiohook` is vendored directly in this repository.

## Recommended toolchain

- Node.js 20, 22, or 24
- `pnpm` 10+
- CMake 3.15+
- Python 3
- Windows: Visual Studio 2022 with Desktop development with C++
- Linux: X11 development headers required by the root `CMakeLists.txt`
- macOS: Xcode command line tools

Windows note: the native build is no longer based on `node-gyp`. We use `cmake-js`, but Visual Studio 2022 is still the supported compiler baseline for maintainers.

Linux packages currently required by the vendored `libuiohook` build:

- `cmake`
- `gcc`
- `gcc-c++`
- `make`
- `ninja-build`
- `libX11-devel`
- `libXrandr-devel`
- `libXt-devel`
- `libXtst-devel`
- `libxkbcommon-devel`
- `libxkbcommon-x11-devel`
- `libxkbfile-devel`

Fedora / WSL example:

```bash
sudo dnf install -y \
  nodejs npm cmake gcc gcc-c++ make ninja-build \
  libX11-devel libXrandr-devel libXt-devel libXtst-devel \
  libxkbcommon-devel libxkbcommon-x11-devel libxkbfile-devel
sudo npm install -g pnpm@10.25.0
```

## Local commands

```powershell
pnpm install --ignore-scripts
pnpm build
pnpm dev
```

Daily commands:

```powershell
pnpm build
pnpm dev
```

Release-only internal commands:

```powershell
node ./scripts/run-cmake-js.mjs build
node ./scripts/build-prebuild.mjs
node ./scripts/verify-prebuilds.mjs
```

`pnpm dev` prints `keydown`, `keypress`, and `keyup` events as you press keys.
Press `Esc` to stop the process.

## Repository layout

- `src/`: TypeScript API surface
- `src/lib/`: N-API glue code
- `libuiohook/`: vendored upstream native library sources
- `CMakeLists.txt`: root native build entrypoint
- `prebuilds/`: distributable native binaries

## Maintenance rules

- Do not reintroduce git submodules for `libuiohook`.
- Do not keep local changes in patch files.
- Keep install-time compilation out of the consumer path.
- Do not reintroduce `binding.gyp` / `node-gyp` into the main build path.
