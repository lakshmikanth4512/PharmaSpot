const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280, // Set initial width of the application window
    height: 720, // Set initial height of the application window
    webPreferences: {
      nodeIntegration: true, // Allow Node.js integration
      contextIsolation: false, // Disable context isolation for compatibility
    },
  });

  // Load the main HTML file
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Handle window closed event
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Event: When Electron has finished initializing
app.on("ready", createWindow);

// Event: Recreate a window when the app is reactivated (macOS only)
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Event: Quit the application when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
