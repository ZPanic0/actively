import { app, BrowserWindow } from 'electron'
import { onActiveWindowChange } from './winAPI'

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  onActiveWindowChange((title) => {
    window.webContents.send('active-window-update', title)
  })

  window.loadFile('index.html')
}

app.allowRendererProcessReuse = true
app.whenReady().then(createWindow)