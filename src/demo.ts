import { EventType, UiohookKey, type UiohookKeyboardEvent, uIOhook } from './'

const keycodeMap = new Map<number, string>(
  Object.entries(UiohookKey).map(([name, code]) => [code, name])
)

function main () {
  console.log('uIOhook keyboard demo started.')
  console.log('Press keys in Windows. Press Esc to stop.')

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

function printKeyboardEvent (event: UiohookKeyboardEvent) {
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

function getEventName (type: UiohookKeyboardEvent['type']) {
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

function formatKeychar (keychar: number) {
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

function shutdown (code: number) {
  try {
    uIOhook.stop()
  } finally {
    process.exit(code)
  }
}

main()
