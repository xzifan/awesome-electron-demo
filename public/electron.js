const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
// const iconv = require('iconv-lite')
const XLSX = require('xlsx');
// const loki = require('lokijs')
// window对象的全局引用
let mainWindow

const getFirstFourDigits = (str) => {
  if(str)
    return str.split('-').slice(0,4).join('-')
  else return 'unknown'
}
const getFormattedDate = () => {
  let date = new Date()
  return date.valueOf()
} 

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

  // var db = new loki('workbooks.db')


  ipcMain.on('minimize-btn',()=>mainWindow.minimize())
  ipcMain.on('maximize',()=>mainWindow.maximize())
  ipcMain.on('close-btn',()=>mainWindow.close())

  ipcMain.on("send-message-to-main",(event,args)=>{
    console.log("主进程接受到的数据是:",args);
    event.reply("send-message-to-renderer","这是来自主进程的问候");
    var workbook = XLSX.readFile(args.FilePath);
    for (const name of  workbook.SheetNames) {
      console.log(name)
    }
    const worksheet = workbook.Sheets[args.selectedSheet]
    const worksheetJSON = XLSX.utils.sheet_to_json(worksheet)
    console.log("-------------"+worksheetJSON.length+' lines of data (including heading) -------------')
    const newData = {}
    const head = Object.keys(worksheetJSON[0])
    console.log('Heading',head)
    if (head.includes('OLTIP') && head.includes('ONUID')){
      console.log("GOOD 2 GO!")

      for (let i = 0; i < worksheetJSON.length ; i++) {
        let item = worksheetJSON[i]
        let label = item['OLTIP'] + '/' + getFirstFourDigits(item['ONUID'])
        if (newData[label] === undefined)
          newData[label] = {
            count: 1,
            addr: item['ONU名称'] || 'unknown'
          }
        else {
          newData[label] = {
            count: newData[label].count +1,
            addr: newData[label].addr === 'unknown' ? (item['ONU名称'] || 'unknown') : newData[label].addr
          }
        }
      }
      const sorted = Object.keys(newData).map(key=>({
        "IPID": key,
        ...newData[key],
      })).sort((a,b)=>b.count-a.count)
      console.log(sorted.length)
      
      const worksheet = XLSX.utils.json_to_sheet(sorted)
      var output_file_name = `${getFormattedDate()}.csv`;
      var stream = XLSX.stream.to_csv(worksheet);
      stream.pipe(fs.createWriteStream(output_file_name));
      
    } else {
      console.log('Bad document! Please check if it contains the correct heading!')
    }
      
  })
  // ipcMain.on('SaveDataFromPathToDB', (event, args)=>{ 
  //   var workbook = XLSX.readFile(args)
    
  //   workbook.SheetNames.forEach(sheetname=>{
  //     if (workbook.Sheets[sheetname]){
  //       console.log(`Creating collection for sheet "${sheetname}" ......`)
  //       var sheetContentJSON = XLSX.utils.sheet_to_json(workbook.Sheets[sheetname])
  //       var sheetCollection = db.addCollection(sheetname)
        
  //       console.log(`Adding ${sheetContentJSON.length} items to collection` )
  //       sheetCollection.insert(sheetContentJSON)
  //     } 
  //     console.log('Complete !')
  //   })
  //   var currentCollections = db.listCollections()
  //   console.log("current collections:",currentCollections)
  //   console.log("钟利军",  db.getCollection(currentCollections[0]).get(10))
  //   // event.returnValue = currentCollections
  //  })
  // ipcMain.on('GetCollectionNamesFromDB',(event)=>{
  //   var currentCollections = db.listCollections()
  //   console.log("current collections:",currentCollections)
  //   event.returnValue = currentCollections
  // })
  // 开发环境
  // mainWindow.loadURL('http://localhost:3000/');

  // 生产环境 
  mainWindow.loadFile(`./build/index.html`);

  // 打开开发者工具，默认不打开
  // mainWindow.webContents.openDevTools()

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