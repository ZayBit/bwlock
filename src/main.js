const electron = require('electron')
const { app, BrowserWindow, MenuItem, Menu } = electron
// express index.js
require('./index')
let win;
const createWindow = (w, h) => {
  // Crea la ventana del navegador.
  win = new BrowserWindow({ width: w, height: h, resizable:false , icon: __dirname + '/icon.png' })
  win.se
  win.loadURL('http://localhost:4040')
  // Emitido cuando la ventana está cerrada.
  win.on('closed', () => {
    win = null
  })
}
app.on("window-all-closed", () => {
  app.quit();
});
app.on('ready', () => {
  createWindow(400, 600)
  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({ role: 'selectall' }))
  ctxMenu.append(new MenuItem({ role: 'copy' }))
  ctxMenu.append(new MenuItem({ role: 'paste' }))
  ctxMenu.append(new MenuItem({ role: 'cut' }))
  ctxMenu.append(new MenuItem({ role: 'toggledevtools' }))
  ctxMenu.append(new MenuItem({ role: 'togglefullscreen' }))
  // Dev Tools Open
  // win.webContents.openDevTools();
  win.setMenu(null)
  win.webContents.on('context-menu', function (e, params) {
    ctxMenu.popup(win, params.x, params.y)
  })
})