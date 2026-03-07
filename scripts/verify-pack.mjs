import { existsSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const rootDir = process.cwd()
const command = process.platform === 'win32'
  ? ['cmd.exe', ['/d', '/s', '/c', 'npm pack --json']]
  : ['npm', ['pack', '--json']]

const result = spawnSync(command[0], command[1], {
  cwd: rootDir,
  env: process.env,
  encoding: 'utf8'
})

const stdout = result.stdout ?? ''
const stderr = result.stderr ?? ''

if (result.status !== 0) {
  process.stderr.write(stderr)
  process.exit(result.status ?? 1)
}

process.stdout.write(stdout)
if (stderr.length > 0) {
  process.stderr.write(stderr)
}

const jsonMatch = stdout.match(/(\[\s*\{[\s\S]*\}\s*\])\s*$/)
if (jsonMatch == null) {
  throw new Error('Could not find npm pack JSON payload in command output.')
}

const packResult = JSON.parse(jsonMatch[1])
if (!Array.isArray(packResult) || packResult.length === 0) {
  throw new Error('npm pack --json did not return any package metadata.')
}

const [{ filename, files }] = packResult
if (typeof filename !== 'string' || !Array.isArray(files)) {
  throw new Error('npm pack --json returned an unexpected payload shape.')
}

const packedPaths = new Set(files.map(file => file.path))
const requiredPaths = [
  'dist/index.js',
  'dist/index.d.ts'
]

for (const requiredPath of requiredPaths) {
  if (!packedPaths.has(requiredPath)) {
    throw new Error(`Packed tarball is missing required file: ${requiredPath}`)
  }
}

const packedPrebuilds = files
  .map(file => file.path)
  .filter(filePath => filePath.startsWith('prebuilds/') && filePath.endsWith('.node'))

if (packedPrebuilds.length === 0) {
  throw new Error('Packed tarball does not contain any prebuilt native binaries under prebuilds/.')
}

const tarballPath = path.join(rootDir, filename)
if (!existsSync(tarballPath)) {
  throw new Error(`npm pack reported tarball ${filename}, but it was not created on disk.`)
}

console.log(`Verified packed tarball ${filename}`)
for (const filePath of packedPrebuilds.sort()) {
  console.log(`- ${filePath}`)
}
