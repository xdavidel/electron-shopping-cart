const electron = require("electron");
const { ipcRenderer } = electron;

const ul = document.querySelector('ul');


// catch add item
ipcRenderer.on('item:add', (e, item) => {
    ul.className = 'collection';
    const li = document.createElement('li');
    li.className = 'collection-item';
    const itemText = document.createTextNode(item);
    li.appendChild(itemText);
    ul.appendChild(li);
});

// catch clear items
ipcRenderer.on('item:clear', () => {
    ul.innerHTML = '';
    ul.className = '';
});

// remove item
ul.addEventListener('dblclick', (e) => {
    e.target.remove();

    if (ul.children.length <= 0) {
        ul.className = '';
    }
})