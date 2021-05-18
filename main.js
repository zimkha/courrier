const electron = require('electron')
const path = require('path')

const BrowserWindow = electron.BrowserWindow
const app = electron.app

app.on('ready', () => {
  createWindow()
})

var phpServer = require('node-php-server');
const port = 8000, host = '127.0.0.1';
const serverUrl = `http://${host}:${port}`;


let mainWindow

function createWindow() {
  // Create a PHP Server
  phpServer.createServer({
    port: port,
    hostname: host,
    base: `${__dirname}/htdocs/courrier/public`,
    keepalive: false,
    open: false,
    bin: `${__dirname}/php/php.exe`,
    router: __dirname + '/htdocs/courrier/server.php'
  });
  
  // Create the browser window.
  const {
    width,
    height
  } = electron.screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false, 
    autoHideMenuBar: true
  })

  mainWindow.loadURL(serverUrl)

  mainWindow.webContents.once('dom-ready', function () {
    mainWindow.show()
    mainWindow.maximize();
    // mainWindow.webContents.openDevTools()
  });

  mainWindow.on('closed', function () {
    phpServer.close();
    mainWindow = null;
  })
}


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    phpServer.close();
    app.quit();
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})