const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow

let createWindow = () => {

    mainWindow = new BrowserWindow({
        width: 1000, height: 600, minWidth: 583, minHeight: 400,
        frame: false, show: false, backgroundColor: '#f3f3f3'
    })

    mainWindow.once('ready-to-show', () => { mainWindow.show() })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    })
)

    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () { mainWindow = null })

}

app.on('ready', function () {
    createWindow()


    // ipc事件区
    ipcMain.on('close-app', app.quit)
    ipcMain.on('maximize-app', () => { if(mainWindow.isMaximized()){ mainWindow.unmaximize() } else { mainWindow.maximize() } })
    ipcMain.on('minimize-app', () => { mainWindow.minimize() })



})

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
