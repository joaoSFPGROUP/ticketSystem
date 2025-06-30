const { app, BrowserWindow, screen: electronScreen, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');

let mainWindow: InstanceType<typeof BrowserWindow> | null = null;

function createWindow() {
  const { width, height } = electronScreen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    icon: path.join(__dirname, 'src', 'images', 'logo32x32.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.on('login-success-user', () => {
    mainWindow?.loadFile(path.join(__dirname, 'pages', 'dashboard.html'));
  });
  ipcMain.on('login-success-admin', () => {
    mainWindow?.loadFile(path.join(__dirname, 'pages', 'dashboardAdmin.html'));
  });
  ipcMain.on('adminPanel', () => {
    mainWindow?.loadFile(path.join(__dirname, 'pages', 'adminPanel.html'));
  });
  ipcMain.on('create-user', () => {
    mainWindow?.loadFile(path.join(__dirname, 'pages', 'createUser.html'));
  });
  ipcMain.on('delete-user', () => {
    mainWindow?.loadFile(path.join(__dirname, 'pages', 'deleteUser.html'));
  });
  ipcMain.on('createTicket', () => {
    mainWindow?.loadFile(path.join(__dirname, 'pages', 'createTicket.html'));
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
