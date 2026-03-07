import { rm } from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const rootDir = process.cwd()
const distDir = path.join(rootDir, 'dist')

await rm(distDir, { recursive: true, force: true })

const tscEntrypoint = path.join(rootDir, 'node_modules', 'typescript', 'bin', 'tsc')
const result = spawnSync(process.execPath, [tscEntrypoint, '-p', 'tsconfig.json'], {
  cwd: rootDir,
  env: process.env,
  stdio: 'inherit'
})

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
