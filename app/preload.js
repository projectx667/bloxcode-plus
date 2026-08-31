const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bloxcodePlus', {
  saveProject(project) {
    return ipcRenderer.invoke('project:save', project);
  },
  openProject() {
    return ipcRenderer.invoke('project:open');
  },
  exportLua(payload) {
    return ipcRenderer.invoke('script:export', payload);
  },
  copyText(text) {
    return ipcRenderer.invoke('clipboard:write', text);
  }
});
