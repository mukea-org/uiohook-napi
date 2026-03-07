import { readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const prebuildsDir = path.join(rootDir, 'prebuilds')

if (!existsSync(prebuildsDir)) {
  throw new Error('Missing prebuilds/ directory. Build native artifacts before packing or publishing.')
}

const tuples = await readdir(prebuildsDir, { withFileTypes: true })
const stagedFiles = []

for (const tuple of tuples) {
  if (!tuple.isDirectory()) {
    continue
  }

  const tupleDir = path.join(prebuildsDir, tuple.name)
  const files = await readdir(tupleDir, { withFileTypes: true })

  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.node')) {
      stagedFiles.push(path.posix.join('prebuilds', tuple.name, file.name))
    }
  }
}

if (stagedFiles.length === 0) {
  throw new Error('No prebuilt .node binaries were found under prebuilds/.')
}

console.log('Verified prebuilt binaries:')
for (const file of stagedFiles.sort()) {
  console.log(`- ${file}`)
}
