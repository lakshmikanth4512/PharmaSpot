const { app, BrowserWindow } = require("electron");
const path = require("path");
const contextMenu = require("electron-context-menu");

// Global reference to the main window
let mainWindow;

// Function to create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // When the window is closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Handle Electron ready event
app.on("ready", () => {
  createWindow();

  // Add a context menu with refresh functionality
  contextMenu({
    prepend: (params, browserWindow) => [
      {
        label: "Refresh",
        click: () => {
          if (mainWindow) {
            mainWindow.reload();
          }
        },
      },
    ],
  });
});

// Quit the app when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Recreate the window if the app is activated (e.g., macOS behavior)
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Error handling
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
