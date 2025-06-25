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
      nodeIntegration: true, // Enable Node.js integration
      contextIsolation: false, // Disable context isolation (legacy compatibility)
    },
  });

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Maximize the window on startup
  mainWindow.maximize();

  // Handle the window close event
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Handle Electron's ready event
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

// Recreate the window when the app is reactivated on macOS
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Error handling for uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Error handling for unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
