/* global info, xelib, registerPatcher, patcherUrl */

function multiplyColors (colorElements, multiplier) {
  colorElements.forEach(colorElement => {
    const value = xelib.GetIntValue(colorElement)
    if (!value) return
    xelib.SetIntValue(colorElement, '', Math.floor(value * multiplier))
  })
}

function multiplyWeatherColors (weatherRecord, weatherColorName, multiplier) {
  multiplyColors(xelib.GetElements(weatherRecord, `NAM0\\${weatherColorName}`), multiplier)
}

function multiplyDALC (weatherRecord, timeOfDay, multiplier) {
  xelib.GetElements(weatherRecord, `Directional Ambient Lighting Colors\\DALC - ${timeOfDay}\\Directional`).forEach(direction => {
    multiplyColors(xelib.GetElements(direction), multiplier)
  })
}

function multiplyCloudColors (weatherRecord, multiplier) {
  xelib.GetElements(weatherRecord, 'PNAM').forEach(layer => xelib.GetElements(layer).forEach(timeOfDayElement => {
    multiplyColors(xelib.GetElements(timeOfDayElement), multiplier)
  }))
}

function isEffect (record) {
  const edid = xelib.EditorID(record)
  return edid ? edid.startsWith('FX') : false
}

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

      locals.weatherColors = [
        { name: 'Sky-Upper\\Night', multiplierType: 'skyNightMult' },
        { name: 'Fog Near\\Night', multiplierType: 'mystNightMult' },
        { name: 'Ambient\\Sunrise', multiplierType: 'ambientDuskDawnMult' },
        { name: 'Ambient\\Sunset', multiplierType: 'ambientDuskDawnMult' },
        { name: 'Ambient\\Night', multiplierType: 'ambientNightMult' },
        { name: 'Sunlight\\Night', multiplierType: 'nightMult' },
        { name: 'Stars\\Sunrise', multiplierType: 'starsMult' },
        { name: 'Stars\\Sunset', multiplierType: 'starsMult' },
        { name: 'Stars\\Night', multiplierType: 'starsMult' },
        { name: 'Sky-Lower\\Night', multiplierType: 'skyNightMult' },
        { name: 'Horizon\\Night', multiplierType: 'skyNightMult' },
        { name: 'Effect Lighting\\Night', multiplierType: 'rainNightMult' },
        { name: 'Fog Far\\Night', multiplierType: 'mystNightMult' },
        { name: 'Sky Statics\\Night', multiplierType: 'skyNightMult' },
        { name: 'Water Multiplier\\Night', multiplierType: 'nightMult' }
      ]
    },
    process: [{
      load: {
        signature: 'WTHR'
      },
      patch: function (record) {
        if (isEffect(record)) {
          multiplyWeatherColors(record, 'Effect Lighting\\Sunrise', locals.mults.effectDuskDawnMult)
          multiplyWeatherColors(record, 'Effect Lighting\\Day', locals.mults.effectDayMult)
          multiplyWeatherColors(record, 'Effect Lighting\\Sunset', locals.mults.effectDuskDawnMult)
          multiplyWeatherColors(record, 'Effect Lighting\\Night', locals.mults.effectNightMult)
          return
        }

        locals.weatherColors.forEach(weatherColor => {
          multiplyWeatherColors(record, weatherColor.name, locals.mults[weatherColor.multiplierType])
        })

        multiplyDALC(record, 'Sunrise', locals.mults.ambientDuskDawnMult)
        multiplyDALC(record, 'Night', locals.mults.ambientNightMult)
        multiplyDALC(record, 'Sunset', locals.mults.ambientDuskDawnMult)

        multiplyCloudColors(record, 0.5)
      }
    }]
  })
})
