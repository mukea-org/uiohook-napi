import { existsSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const rootDir = process.cwd()
const cmakeJsEntrypoint = path.join(rootDir, 'node_modules', 'cmake-js', 'bin', 'cmake-js')
const args = process.argv.slice(2)

const result = process.platform === 'win32'
  ? runOnWindows(args)
  : runDirect(args)

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}

function runDirect(args) {
  return spawnSync(process.execPath, [cmakeJsEntrypoint, ...args], {
    cwd: rootDir,
    env: process.env,
    stdio: 'inherit'
  })
}

function runOnWindows(args) {
  if (hasCommand('cmake')) {
    return runDirect(args)
  }

  const toolchain = detectVisualStudioToolchain()
  if (toolchain == null) {
    console.error('Unable to locate CMake in PATH or in a supported Visual Studio installation.')
    return { status: 1 }
  }

  const effectiveArgs = args.some(arg => arg === '-G' || arg === '--generator')
    ? args
    : [...args, '-G', 'Ninja']

  return spawnSync('cmd.exe', ['/d', '/c', path.join(rootDir, 'scripts', 'run-cmake-js-win.cmd'), ...effectiveArgs], {
    cwd: rootDir,
    env: {
      ...process.env,
      UIOHOOK_NODE_EXE: process.execPath,
      UIOHOOK_VCVARS64: toolchain.vcvars64,
      UIOHOOK_CMAKE_BIN: toolchain.cmakeBin,
      UIOHOOK_NINJA_DIR: toolchain.ninjaDir
    },
    stdio: 'inherit'
  })
}

function detectVisualStudioToolchain() {
  const vswhere = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe'
  if (!existsSync(vswhere)) {
    return null
  }

  const result = spawnSync(vswhere, [
    '-latest',
    '-products', '*',
    '-requires', 'Microsoft.VisualStudio.Component.VC.Tools.x86.x64',
    '-property', 'installationPath'
  ], {
    cwd: rootDir,
    encoding: 'utf8'
  })

  if (result.status !== 0) {
    return null
  }

  const installationPath = result.stdout.trim()
  if (!installationPath) {
    return null
  }

  const vcvars64 = path.join(installationPath, 'VC', 'Auxiliary', 'Build', 'vcvars64.bat')
  const cmakeBin = path.join(installationPath, 'Common7', 'IDE', 'CommonExtensions', 'Microsoft', 'CMake', 'CMake', 'bin')
  const ninjaDir = path.join(installationPath, 'Common7', 'IDE', 'CommonExtensions', 'Microsoft', 'CMake', 'Ninja')

  if (!existsSync(vcvars64) || !existsSync(path.join(cmakeBin, 'cmake.exe')) || !existsSync(path.join(ninjaDir, 'ninja.exe'))) {
    return null
  }

  return { vcvars64, cmakeBin, ninjaDir }
}

function hasCommand(command) {
  const probe = spawnSync(command, ['--version'], {
    cwd: rootDir,
    env: process.env,
    stdio: 'ignore'
  })
  return probe.status === 0
}
