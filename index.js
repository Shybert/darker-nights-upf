/* global info, xelib, registerPatcher, patcherUrl */

registerPatcher({
  info: info,
  gameModes: [xelib.gmSSE, xelib.gmTES5],
  settings: {
    label: 'Darker Nights UPF Patcher',
    templateUrl: `${patcherUrl}/partials/settings.html`,
    defaultSettings: {}
  },
  execute: (patchFile, helpers, settings, locals) => ({
    process: [{
      load: {
        signature: 'WTHR'
      },
      patch: function (record) {
        helpers.logMessage(`Patching ${xelib.LongName(record)}`)
      }
    }]
  })
})
