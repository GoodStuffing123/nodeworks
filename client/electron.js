const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const loadMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 810,
    backgroundColor: "#000000",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
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
