"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const desktopBridge = {
    isDesktop: true,
    selectDirectory: () => electron_1.ipcRenderer.invoke('desktop:select-directory'),
    fs: {
        writeFile: (payload) => electron_1.ipcRenderer.invoke('desktop:fs:write-file', payload),
        readFile: (payload) => electron_1.ipcRenderer.invoke('desktop:fs:read-file', payload),
        createDirectory: (payload) => electron_1.ipcRenderer.invoke('desktop:fs:create-directory', payload),
        exists: (payload) => electron_1.ipcRenderer.invoke('desktop:fs:exists', payload),
        listDirectory: (payload) => electron_1.ipcRenderer.invoke('desktop:fs:list-directory', payload),
    },
    openExternal: (url) => electron_1.ipcRenderer.invoke('desktop:open-external', { url }),
};
electron_1.contextBridge.exposeInMainWorld('choutexDesktop', desktopBridge);
