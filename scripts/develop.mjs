import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { createRequire } from 'node:module'

const rootDir = process.cwd()

runNodeScript('build.mjs')
runNodeScript('prebuild.mjs')

const require = createRequire(import.meta.url)
const { EventType, UiohookKey, uIOhook } = require(path.join(rootDir, 'dist', 'index.js'))

const keycodeMap = new Map(
  Object.entries(UiohookKey).map(([name, code]) => [code, name])
)

main()

function runNodeScript (scriptName) {
  const result = spawnSync(process.execPath, [path.join(rootDir, 'scripts', scriptName)], {
    cwd: rootDir,
    env: process.env,
    stdio: 'inherit'
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function main () {
  console.log('uIOhook development listener started.')
  console.log('Press keys to inspect events. Press Esc to stop.')

  uIOhook.on('keydown', (event) => {
    printKeyboardEvent(event)

    if (event.keycode === UiohookKey.Escape) {
      shutdown(0)
    }
  })

  uIOhook.on('keypress', (event) => {
    printKeyboardEvent(event)
  })

  uIOhook.on('keyup', (event) => {
    printKeyboardEvent(event)
  })

  process.on('SIGINT', () => {
    shutdown(0)
  })

  uIOhook.start()
}

function printKeyboardEvent (event) {
  const type = getEventName(event.type)
  const keyName = keycodeMap.get(event.keycode) ?? 'Unknown'
  const charDisplay = formatKeychar(event.keychar)
  const modifiers = [
    event.ctrlKey ? 'ctrl' : null,
    event.shiftKey ? 'shift' : null,
    event.altKey ? 'alt' : null,
    event.metaKey ? 'meta' : null,
  ].filter(Boolean).join('+') || '-'

  console.log(
    [
      `[${type}]`,
      `key=${keyName}`,
      `keycode=0x${event.keycode.toString(16).toUpperCase()}`,
      `rawcode=0x${event.rawcode.toString(16).toUpperCase()}`,
      `keychar=${charDisplay}`,
      `modifiers=${modifiers}`,
      `time=${event.time}`,
    ].join(' ')
  )
}

function getEventName (type) {
  switch (type) {
    case EventType.EVENT_KEY_TYPED:
      return 'keypress'
    case EventType.EVENT_KEY_PRESSED:
      return 'keydown'
    case EventType.EVENT_KEY_RELEASED:
      return 'keyup'
    default:
      return `type-${type}`
  }
}

function formatKeychar (keychar) {
  if (!keychar) {
    return '-'
  }

  try {
    const value = String.fromCodePoint(keychar)
    return `${JSON.stringify(value)}(0x${keychar.toString(16).toUpperCase()})`
  } catch {
    return `0x${keychar.toString(16).toUpperCase()}`
  }
}

function shutdown (code) {
  try {
    uIOhook.stop()
  } finally {
    process.exit(code)
  }
}
