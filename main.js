const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const ipc = electron.ipcMain

let mainWindow

let createWindow = () => {

    mainWindow = new BrowserWindow({
        width: 1000, height: 600, frame: false,
        minWidth: 500, minHeight: 400
    })

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

    ipc.on('close-app', app.quit)
<<<<<<< HEAD
    ipc.on('maxmize-app', () => {
        if(mainWindow.isMaximized()){
            mainWindow.unmaximize()
        } else {
            mainWindow.maximize()
        }
    })
=======
    ipc.on('maximize-app', () => {
        if(mainWindow.isMaximized()){ mainWindow.unmaximize() } else { mainWindow.maximize() }
    })
    ipc.on('minimize-app', () => { mainWindow.minimize() })
>>>>>>> origin/master

})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
})
