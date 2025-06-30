document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-user-form') as HTMLFormElement | null;

    document.getElementById('back-button')?.addEventListener('click', () => {
        console.log("Pressed");
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('adminPanel');
    });

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const usernameInput = document.getElementById('username') as HTMLInputElement | null;
            const passwordInput = document.getElementById('password') as HTMLInputElement | null;
            const roleInput = document.getElementById('user-role') as HTMLSelectElement | null;

            const nome = usernameInput?.value || '';
            const password = passwordInput?.value || '';
            const permissions = roleInput?.value || '';

            if (!nome || !password || !permissions) {
                return;
            }

            const createUser = { nome, password, permissions };

            try {
                const response = await fetch('http://192.168.1.14:3000/register', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                     },
                    body: JSON.stringify(createUser)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                await response.json();

                // Limpa o formulário após sucesso
                form.reset();

                // Forçar foco no primeiro input depois do reset
                usernameInput?.focus();

                // Dá um pequeno delay antes de enviar o ipcRenderer para garantir que o foco foi aplicado
                setTimeout(() => {
                    const { ipcRenderer } = require('electron');
                    ipcRenderer.send('adminPanel');
                }, 100); // 100ms é suficiente, pode ajustar

            } catch (error) {
                console.error('Erro completo:', error);
            }
        });
    }
});