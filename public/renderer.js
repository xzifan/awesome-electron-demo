const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", ()=>{
  window.__custom_menu_ = {
    close_app() {
      ipcRenderer.send("close-btn", true)
    },
    minimize_app() {
      ipcRenderer.send("minimize-btn", true)
    }
  }
  const close_app = () => {
    console.log('close_app')
    ipcRenderer.send("close-btn", true)
  }
  const minimize_app = () => {
    console.log('minimize_app')
    ipcRenderer.send("minimize-btn", true)
  }
  document.getElementById('minimize-btn').addEventListener('click',minimize_app)

  document.getElementById('close-btn').addEventListener('click',close_app)
})
