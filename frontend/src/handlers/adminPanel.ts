document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('back-button')?.addEventListener('click', () => {
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('login-success-admin');
    });

    document.getElementById('create-user-btn')?.addEventListener('click', () => {
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('create-user');
    });

    document.getElementById('delete-user-btn')?.addEventListener('click', () => {
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('delete-user');
    });

    document.getElementById('createUserBox')?.addEventListener('click', (e) => {
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('create-user');
    })

    document.getElementById('deleteUserBox')?.addEventListener('click', (e) => {
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('delete-user');
    });
});