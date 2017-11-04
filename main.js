const electron = require("electron");
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

// set ENV
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;


app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main-window', 'main-window.html'),
        protocol: 'file',
        slashes: true
    }));

    // quit app when close
    mainWindow.on('close', () => {
        app.quit();
    })

    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
})

// Handle create addWindow
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: 'Add Shopping Items'
    });
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'add-window', 'add-window.html'),
        protocol: 'file',
        slashes: true
    }));

    // for garbage collection
    addWindow.on('close', () => {
        addWindow = null;
    })
}

// catch item add
ipcMain.on('item:add', (e, item) => {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})

// Create menu template
const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
        label: 'Add Item',
        accelerator:isMac() ? 'Command+N' : 'Ctrl+N',
        click() {
            createAddWindow();
        }
    }, {
        label: 'Clear Items',
        click() {
            mainWindow.webContents.send('item:clear');
        }
    }, {
        label: 'Exit',
        accelerator: isMac() ? 'Command+Q' : 'Ctrl+Q',
        click() {
            app.quit();
        }
    }]
}];

// if mac -> add empty object to menu
if (isMac()) {
    mainMenuTemplate.unshift({});
}

// add developer tools if not in prod
if (process.env.NODE_ENV != 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [{
                label: 'Toggle DevTools',
                accelerator: isMac() ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }

        ]
    })
}

// check if platform is a mac
function isMac() {
    return process.platform == 'darwin';
}