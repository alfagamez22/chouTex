"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const electron_1 = require("electron");
let mainWindow = null;
const isDev = Boolean(process.env.ELECTRON_DEV_SERVER_URL);
const shouldOpenDevTools = process.env.CHOUTEX_OPEN_DEVTOOLS === 'true';
function normalizeRelativePath(relativePath) {
    const normalized = relativePath
        .replace(/\\/g, '/')
        .replace(/^\/+/, '')
        .split('/')
        .filter(Boolean);
    const safeSegments = [];
    for (const segment of normalized) {
        if (segment === '.')
            continue;
        if (segment === '..') {
            throw new Error('Parent directory traversal is not allowed');
        }
        safeSegments.push(segment);
    }
    return safeSegments.join(node_path_1.default.sep);
}
function resolveSafePath(rootPath, relativePath) {
    const absoluteRoot = node_path_1.default.resolve(rootPath);
    const safeRelativePath = normalizeRelativePath(relativePath);
    const resolvedPath = node_path_1.default.resolve(absoluteRoot, safeRelativePath);
    if (resolvedPath !== absoluteRoot &&
        !resolvedPath.startsWith(`${absoluteRoot}${node_path_1.default.sep}`)) {
        throw new Error('Path traversal attempt blocked');
    }
    return resolvedPath;
}
function registerIpcHandlers() {
    electron_1.ipcMain.handle('desktop:select-directory', async () => {
        const result = await electron_1.dialog.showOpenDialog(mainWindow ?? undefined, {
            properties: ['openDirectory', 'createDirectory'],
        });
        if (result.canceled || result.filePaths.length === 0) {
            return { canceled: true };
        }
        const selectedPath = node_path_1.default.resolve(result.filePaths[0]);
        return {
            canceled: false,
            path: selectedPath,
            name: node_path_1.default.basename(selectedPath),
        };
    });
    electron_1.ipcMain.handle('desktop:fs:write-file', async (_event, payload) => {
        const targetPath = resolveSafePath(payload.rootPath, payload.relativePath);
        await promises_1.default.mkdir(node_path_1.default.dirname(targetPath), { recursive: true });
        if (payload.isBinary) {
            const rawContent = payload.content instanceof Uint8Array
                ? payload.content
                : payload.content instanceof ArrayBuffer
                    ? new Uint8Array(payload.content)
                    : Buffer.from(payload.content);
            await promises_1.default.writeFile(targetPath, Buffer.from(rawContent));
            return;
        }
        await promises_1.default.writeFile(targetPath, String(payload.content), 'utf8');
    });
    electron_1.ipcMain.handle('desktop:fs:read-file', async (_event, payload) => {
        const targetPath = resolveSafePath(payload.rootPath, payload.relativePath);
        if (payload.isBinary) {
            const data = await promises_1.default.readFile(targetPath);
            const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
            return { kind: 'binary', content: buffer };
        }
        const text = await promises_1.default.readFile(targetPath, 'utf8');
        return { kind: 'text', content: text };
    });
    electron_1.ipcMain.handle('desktop:fs:create-directory', async (_event, payload) => {
        const targetPath = resolveSafePath(payload.rootPath, payload.relativePath);
        await promises_1.default.mkdir(targetPath, { recursive: true });
    });
    electron_1.ipcMain.handle('desktop:fs:exists', async (_event, payload) => {
        try {
            const targetPath = resolveSafePath(payload.rootPath, payload.relativePath);
            await promises_1.default.access(targetPath);
            return true;
        }
        catch {
            return false;
        }
    });
    electron_1.ipcMain.handle('desktop:fs:list-directory', async (_event, payload) => {
        const targetPath = resolveSafePath(payload.rootPath, payload.relativePath);
        const dirEntries = await promises_1.default.readdir(targetPath, { withFileTypes: true });
        return dirEntries.map((entry) => entry.name);
    });
    electron_1.ipcMain.handle('desktop:open-external', async (_event, payload) => {
        await electron_1.shell.openExternal(payload.url);
    });
}
async function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 960,
        minHeight: 640,
        show: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: node_path_1.default.join(__dirname, 'preload.cjs'),
        },
    });
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });
    if (isDev && process.env.ELECTRON_DEV_SERVER_URL) {
        await mainWindow.loadURL(process.env.ELECTRON_DEV_SERVER_URL);
        if (shouldOpenDevTools) {
            mainWindow.webContents.openDevTools({ mode: 'detach' });
        }
        return;
    }
    await mainWindow.loadFile(node_path_1.default.join(__dirname, '../dist/index.html'));
}
electron_1.app.whenReady().then(async () => {
    registerIpcHandlers();
    await createWindow();
    electron_1.app.on('activate', async () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            await createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
