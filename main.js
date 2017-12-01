const { app, BrowserWindow } = require('electron')
const server = require('./dist/index')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({ width: 1000, height: 1000 })
  mainWindow.loadURL('http://localhost:8080/')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
