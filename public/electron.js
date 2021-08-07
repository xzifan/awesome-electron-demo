const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path')

// window对象的全局引用
let mainWindow

app.on('ready', ()=>{
  mainWindow = new BrowserWindow({ 
    width: 1600, 
    height: 900,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // 注入node模块
      enableRemoteModule: true,
      webSecurity: false,
      javascript: true,
      contextIsolation: false,
    },
    
  })
  ipcMain.on('minimize-btn',()=>mainWindow.minimize())
  ipcMain.on('maximize',()=>mainWindow.maximize())
  ipcMain.on('close-btn',()=>mainWindow.close())
  // 开发环境
  mainWindow.loadURL('http://localhost:3000/');

  // 生产环境 
  // mainWindow.loadFile(`./build/index.html`);

  // 打开开发者工具，默认不打开
  mainWindow.webContents.openDevTools()

  // 关闭window时触发下列事件.
  mainWindow.on('closed', function () {
    mainWindow = null
    app.exit()
  })
});

const isMac = process.platform === "darwin";

const template = [
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

ipcMain.on(`display-app-menu`, function(e, args) {
  if (isWindows && mainWindow) {
    menu.popup({
      window: mainWindow,
      x: args.x,
      y: args.y
    });
  }
});

// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// app.on('activate', function () {

//   if (mainWindow === null) {
//     createWindow()
//   }
// })