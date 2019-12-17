const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow

let createWindow = () => {

    mainWindow = new BrowserWindow({
        width: 1000, height: 600, minWidth: 663, minHeight: 400,
        frame: false, show: false, backgroundColor: '#f3f3f3',
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.once('ready-to-show', () => { mainWindow.show() })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    })
)

    // 打开控制台
    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () { mainWindow = null })

}

app.on('ready', function () {
    createWindow()

    // ipc事件区
    ipcMain.on('app-close', app.quit)
    ipcMain.on('app-maximize', () => { if(mainWindow.isMaximized()){ mainWindow.unmaximize() } else { mainWindow.maximize() } })
    ipcMain.on('app-minimize', () => { mainWindow.minimize() })

})

app.on('window-all-closed', function () {
    process.platform !== 'darwin' && app.quit()
})

app.on('activate', function () {
    mainWindow === null && createWindow()
})
