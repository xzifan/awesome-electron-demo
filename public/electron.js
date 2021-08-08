const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path')
// const iconv = require('iconv-lite')
const XLSX = require('xlsx');
const loki = require('lokijs')
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

  var db = new loki('workbooks.db')


  ipcMain.on('minimize-btn',()=>mainWindow.minimize())
  ipcMain.on('maximize',()=>mainWindow.maximize())
  ipcMain.on('close-btn',()=>mainWindow.close())
  ipcMain.on('SaveDataFromPathToDB', (event, args)=>{ 
    var workbook = XLSX.readFile(args)
    
    workbook.SheetNames.forEach(sheetname=>{
      if (workbook.Sheets[sheetname]){
        console.log(`Creating collection for sheet "${sheetname}" ......`)
        var sheetContentJSON = XLSX.utils.sheet_to_json(workbook.Sheets[sheetname])
        var sheetCollection = db.addCollection(sheetname)
        
        console.log(`Adding ${sheetContentJSON.length} items to collection` )
        sheetCollection.insert(sheetContentJSON)
      } 
      console.log('Complete !')
    })
    var currentCollections = db.listCollections()
    console.log("current collections:",currentCollections)
    event.returnValue = currentCollections
   })
  ipcMain.on('GetCollectionNamesFromDB',(event)=>{
    var currentCollections = db.listCollections()
    console.log("current collections:",currentCollections)
    event.returnValue = currentCollections
  })
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