const { app, BrowserWindow, ipcMain } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

const loadMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 810,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // enableRemoteModule: false,
    },
    frame: false,
    vibrancy: "popover",
    visualEffectState: "active",
    fullscreenable: true,
  });

  mainWindow.loadURL(
    isDev ? (
      `http://localhost:${process.env.PORT || 3000}`
    ) : (
      `file://${path.join(__dirname, "index.html")}`
    )
  );
};

app.on("ready", loadMainWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    loadMainWindow();
  }
});

ipcMain.handle("close-current-window", () => {
  BrowserWindow.getFocusedWindow().close();
});

ipcMain.handle("minimize-current-window", () => {
  BrowserWindow.getFocusedWindow().minimize();
});

ipcMain.handle("toggle-full-screen-current-window", () => {
  const currentWindow = BrowserWindow.getFocusedWindow();
  const nextFullScreenState = !currentWindow.fullScreen;

  currentWindow.setFullScreen(nextFullScreenState);

  return nextFullScreenState;
});
