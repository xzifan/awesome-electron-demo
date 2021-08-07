const { contextBridge, ipcRenderer } = require('electron')
const path = require('path')
global.electron = require('electron');

// contextBridge.exposeInMainWorld('electron', {
//   startDrag: (fileName) => {
//     ipcRenderer.send('ondragstart', path.join(process.cwd(), fileName))
//   },
//   closeWindow: ()=> {
//     ipcRenderer.send('onclosed')
//   }
// })

const {
  getCurrentWindow,
  openMenu,
  minimizeWindow,
  unmaximizeWindow,
  maxUnmaxWindow,
  isWindowMaximized,
  closeWindow,
} = require("./menu-functions");
window.__menu_functions = 'sdaad'
window.addEventListener("DOMContentLoaded", () => {
  window.openMenu = openMenu;
  window.minimizeWindow = minimizeWindow;
  window.unmaximizeWindow = unmaximizeWindow;
  window.maxUnmaxWindow = maxUnmaxWindow;
  window.isWindowMaximized = isWindowMaximized;
  window.closeWindow = closeWindow;
});

