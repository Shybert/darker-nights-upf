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
    initialize: (patchFile, helpers, settings, locals) => {
      const base = -0.94
      locals.mults = {
        nightMult: 1 + base,
        duskDawnMult: 1 + base * 0.5,
        ambientNightMult: 1 + base * 0.825,
        ambientDuskDawnMult: 1 + base * 0.4,
        ambientDayMult: 1 + base,
        effectNightMult: 1 + base * 0.625,
        effectDuskDawnMult: 1 + base * 0.5,
        effectDayMult: 1 + base * 0.35,
        mystNightMult: 1 + base * 0.75,
        mystDuskDawnMult: 1 + base * 0.85,
        rainNightMult: 1 + base * 0.95,
        rainDuskDawnMult: 1 + base * 0.2,
        magicNightMult: 1 + (base * 0.5) - 0.3,
        magicDuskDawnMult: 1 + (base * 0.6) - 0.1,
        skyNightMult: 1 + base * 0.625,
        skyDuskDawnMult: 1 + base * 0.25,
        starsMult: 0.8
      }
    },
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
