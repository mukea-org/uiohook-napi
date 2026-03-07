import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const rootDir = process.cwd()

const packageJsonPath = path.join(rootDir, 'package.json')
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'))
const stageDir = path.join(rootDir, 'build', `github-package-${packageJson.version}`)

await rm(stageDir, { recursive: true, force: true })
await mkdir(stageDir, { recursive: true })

packageJson.name = '@mukea-org/uiohook-napi'

await writeFile(
  path.join(stageDir, 'package.json'),
  `${JSON.stringify(packageJson, null, 2)}\n`
)

for (const entry of ['README.md', 'LICENSE']) {
  await cp(path.join(rootDir, entry), path.join(stageDir, entry))
}

for (const directory of ['dist', 'prebuilds']) {
  await cp(path.join(rootDir, directory), path.join(stageDir, directory), { recursive: true })
}

console.log(`Staged GitHub package workspace at ${path.relative(rootDir, stageDir)}`)
