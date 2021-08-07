const { ipcRenderer } = require("electron");

// window.addEventListener("DOMContentLoaded", () => {
//     // const menuButton = document.getElementById("menu-btn");
//     const minimizeButton = document.getElementById("minimize-btn");
//     // const maxUnmaxButton = document.getElementById("max-unmax-btn");
//     const closeButton = document.getElementById("close-btn");
  
//     // menuButton.addEventListener("click", e => {
//     //   // Opens menu at (x,y) coordinates of mouse click on the hamburger icon.
//     //   window.openMenu(e.x, e.y);
//     // });
//     console.log(minimizeButton, window)
//     minimizeButton.addEventListener("click", e => {
//       window.minimizeWindow();
//     });
  
//     // maxUnmaxButton.addEventListener("click", e => {
//     //   const icon = maxUnmaxButton.querySelector("i.far");
  
//     //   window.maxUnmaxWindow();
  
//     //   // Change the middle maximize-unmaximize icons.
//     //   if (window.isWindowMaximized()) {
//     //     icon.classList.remove("fa-square");
//     //     icon.classList.add("fa-clone");
//     //   } else {
//     //     icon.classList.add("fa-square");
//     //     icon.classList.remove("fa-clone");
//     //   }
//     // });
  
//     closeButton.addEventListener("click", e => {
//       window.closeWindow();
//     });
//   });
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
