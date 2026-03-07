import { copyFile, mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const rootDir = process.cwd()
const platform = process.env.npm_config_platform || process.platform
const arch = process.env.npm_config_arch || process.arch
const tuple = `${platform}-${arch}`
const prebuildDir = path.join(rootDir, 'prebuilds', tuple)
const sourceCandidates = [
  path.join(rootDir, 'build', 'Release', 'uiohook_napi.node'),
  path.join(rootDir, 'build', 'Debug', 'uiohook_napi.node')
]

const libcTag = platform === 'linux'
  ? (existsSync('/etc/alpine-release') ? 'musl' : 'glibc')
  : null

const outputFile = libcTag == null ? 'node.napi.node' : `node.napi.${libcTag}.node`

const runCmakeJsEntrypoint = path.join(rootDir, 'scripts', 'run-cmake-js.mjs')
const buildResult = spawnSync(process.execPath, [runCmakeJsEntrypoint, 'build'], {
  cwd: rootDir,
  env: process.env,
  stdio: 'inherit'
})

if (buildResult.status !== 0) {
  process.exit(buildResult.status ?? 1)
}

const builtFile = sourceCandidates.find(file => existsSync(file))
if (builtFile == null) {
  throw new Error(`Could not find built addon in any expected location: ${sourceCandidates.join(', ')}`)
}

await rm(prebuildDir, { recursive: true, force: true })
await mkdir(prebuildDir, { recursive: true })
await copyFile(builtFile, path.join(prebuildDir, outputFile))

console.log(`Staged prebuild ${path.relative(rootDir, builtFile)} -> prebuilds/${tuple}/${outputFile}`)
