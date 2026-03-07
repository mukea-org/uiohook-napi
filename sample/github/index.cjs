const pkg = require('@mukea-org/uiohook-napi')

console.log('resolved', require.resolve('@mukea-org/uiohook-napi'))
console.log('keycode-q', pkg.UiohookKey.Q)

pkg.uIOhook.stop()
console.log('native-binding-ok')
