require("@electron/remote/main").initialize(); // Initialize Electron Remote
const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const contextMenu = require("electron-context-menu"); // Context menu for right-click actions

// Squirrel Events for handling Windows installer events
const setupEvents = require("./installers/setupEvents");
if (setupEvents.handleSquirrelEvent()) {
    return; // Exit if a Squirrel event was handled
}

let mainWindow;

function createWindow() {
    // Get primary display size for setting window dimensions
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    // Create the main application window
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        frame: true,
        webPreferences: {
            nodeIntegration: true, // Allow Node.js integration
            enableRemoteModule: true, // Enable @electron/remote
            contextIsolation: false, // Context isolation off for backward compatibility
        },
    });

    mainWindow.maximize(); // Maximize the window
    mainWindow.show(); // Show the window

    // Load the main HTML file
    mainWindow.loadURL(`file://${path.join(__dirname, "index.html")}`);

    // Handle window close event
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// Event listener for when Electron is ready
app.on("ready", () => {
    createWindow();
});

// Recreate the window when the app is reactivated on macOS
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// Quit the application when all windows are closed, except on macOS
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
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

// IPC event handlers for communication between main and renderer process
ipcMain.on("app-quit", () => {
    app.quit();
});

ipcMain.on("app-reload", () => {
    if (mainWindow) {
        mainWindow.reload();
    }
});

// Add a context menu with basic options
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

// Live reload during development
if (!app.isPackaged) {
    try {
        require("electron-reloader")(module);
    } catch (error) {
        console.error("Error enabling live reload:", error);
    }
}

// Enable @electron/remote for all created browser windows
app.on("browser-window-created", (_, window) => {
    require("@electron/remote/main").enable(window.webContents);
});
