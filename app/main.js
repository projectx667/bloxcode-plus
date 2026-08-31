const { app, BrowserWindow, clipboard, dialog, ipcMain } = require('electron');
const fs = require('fs/promises');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 980,
    minHeight: 640,
    backgroundColor: '#181818',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));
}

function sanitizedProjectName(name) {
  const cleaned = String(name || 'bloxcode-project')
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
    .trim()
    .slice(0, 90);
  return cleaned || 'bloxcode-project';
}

function registerLocalProjectHandlers() {
  ipcMain.handle('project:save', async (event, project) => {
    if (!project || typeof project !== 'object' || !project.workspace) {
      throw new Error('A BloxCode Plus project workspace is required before saving.');
    }

    const parentWindow = BrowserWindow.fromWebContents(event.sender);
    const name = sanitizedProjectName(project.name);
    const result = await dialog.showSaveDialog(parentWindow, {
      title: 'Save BloxCode Plus project',
      defaultPath: path.join(app.getPath('documents'), `${name}.blox`),
      filters: [{ name: 'BloxCode Plus projects', extensions: ['blox'] }]
    });

    if (result.canceled || !result.filePath) return { canceled: true };

    await fs.writeFile(result.filePath, JSON.stringify(project, null, 2), 'utf8');
    return {
      canceled: false,
      path: result.filePath,
      name: path.basename(result.filePath, path.extname(result.filePath))
    };
  });

  ipcMain.handle('project:open', async (event) => {
    const parentWindow = BrowserWindow.fromWebContents(event.sender);
    const result = await dialog.showOpenDialog(parentWindow, {
      title: 'Open BloxCode Plus project',
      properties: ['openFile'],
      filters: [{ name: 'BloxCode Plus projects', extensions: ['blox', 'json'] }]
    });

    if (result.canceled || !result.filePaths[0]) return { canceled: true };

    const filePath = result.filePaths[0];
    const content = await fs.readFile(filePath, 'utf8');
    try {
      const project = JSON.parse(content);
      if (!project || typeof project !== 'object') throw new Error('Project content is invalid.');
      return { canceled: false, path: filePath, project };
    } catch (error) {
      throw new Error(`The selected file is not a valid BloxCode Plus project: ${error.message}`);
    }
  });

  ipcMain.handle('script:export', async (event, payload) => {
    if (!payload || typeof payload.code !== 'string' || !payload.code.trim()) {
      throw new Error('Luau code is required before exporting.');
    }

    const parentWindow = BrowserWindow.fromWebContents(event.sender);
    const name = sanitizedProjectName(payload.name);
    const result = await dialog.showSaveDialog(parentWindow, {
      title: 'Export BloxCode Plus Luau',
      defaultPath: path.join(app.getPath('documents'), `${name}.lua`),
      filters: [{ name: 'Luau scripts', extensions: ['lua', 'luau'] }]
    });

    if (result.canceled || !result.filePath) return { canceled: true };

    await fs.writeFile(result.filePath, payload.code, 'utf8');
    return { canceled: false, path: result.filePath };
  });

  ipcMain.handle('clipboard:write', (_event, text) => {
    clipboard.writeText(String(text || ''));
    return true;
  });
}

app.whenReady().then(() => {
  registerLocalProjectHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
