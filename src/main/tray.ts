import { Tray, Menu, nativeImage, app } from 'electron'
import { join } from 'node:path'
import { getPrefs } from './store'

let tray: Tray | null = null

/** Creates the menu-bar / system-tray icon and its menu. */
export function createTray(
  onTestFlight: () => void,
  onSettings: () => void,
  onTogglePresentation: () => void
): Tray {
  // createFromPath automatically picks up the @2x variant when present.
  let image = nativeImage.createFromPath(
    join(app.getAppPath(), 'build', 'iconTemplate.png')
  )
  if (image.isEmpty()) {
    image = nativeImage.createEmpty()
  }
  // Template image = macOS auto-adapts it to light/dark menu bars.
  if (process.platform === 'darwin') {
    image.setTemplateImage(true)
  }

  tray = new Tray(image)
  tray.setToolTip('Quakpit')
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Open Quakpit', click: onSettings },
      { label: 'Send a test flight  (⌘⇧D)', click: onTestFlight },
      {
        label: 'Presentation mode — pause reminders  (⌘⇧P)',
        type: 'checkbox',
        checked: getPrefs().presentationMode,
        click: onTogglePresentation
      },
      { type: 'separator' },
      { label: 'Quit Quakpit', click: () => app.quit() }
    ])
  )
  return tray
}
