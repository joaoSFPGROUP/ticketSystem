const { app, BrowserWindow, screen: electronScreen, ipcMain, dialog, Tray, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');

let mainWindow: InstanceType<typeof BrowserWindow> | null = null;
let updateWindow: InstanceType<typeof BrowserWindow>  | null = null;
let tray: any = null;

function createWindow() {
  const { width, height } = electronScreen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    icon: path.join(__dirname, 'images', 'logo32x32.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('minimize',  (event: Event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', (event: Event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  if (!tray) {
    tray = new Tray(path.join(__dirname, 'images', 'logo32x32.ico'));

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Mostrar',
        click: () => {
          mainWindow.show();
        },
      },
      {
        label: 'Sair',
        click: () => {
          app.isQuiting = true;
          app.quit();
        },
      },
    ]);

    tray.setToolTip('Sistema de Tickets');
    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
      mainWindow.show();
    });
  }
}

function createUpdateWindow() {
  updateWindow = new BrowserWindow({
    width: 400,
    height: 150,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    icon: path.join(__dirname, 'images', 'logo32x32.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  updateWindow.loadFile(path.join(__dirname, 'pages', 'update.html'));
}

app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Atualização disponível',
      message: 'Uma nova atualização está a ser descarregada.',
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Atualização pronta',
      message: 'Atualização descarregada. A aplicação vai reiniciar para aplicar a atualização.',
    }).then(() => {
      autoUpdater.quitAndInstall();
    });
  });

  ipcMain.on('login-success-user', () => {
    mainWindow.loadFile(path.join(__dirname, 'pages', 'dashboard.html'));
  });

  ipcMain.on('login-success-admin', () => {
    mainWindow.loadFile(path.join(__dirname, 'pages', 'dashboardAdmin.html'));
  });

  ipcMain.on('adminPanel', () => {
    mainWindow.loadFile(path.join(__dirname, 'pages', 'adminPanel.html'));
  });

  ipcMain.on('create-user', () => {
    mainWindow.loadFile(path.join(__dirname, 'pages', 'createUser.html'));
  });

  ipcMain.on('delete-user', () => {
    mainWindow.loadFile(path.join(__dirname, 'pages', 'deleteUser.html'));
  });

  ipcMain.on('createTicket', () => {
    mainWindow.loadFile(path.join(__dirname, 'pages', 'createTicket.html'));
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
