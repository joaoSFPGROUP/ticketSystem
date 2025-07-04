interface TicketData {
    nome: string;
    descricao: string;
    estado: string;
    utilizador_id: number | null;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-ticket-form') as HTMLFormElement | null;
    const backButton = document.getElementById('back-button');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nomeInput = document.getElementById('nome') as HTMLInputElement | null;
            const descricaoInput = document.getElementById('descricao') as HTMLInputElement | null;

            const nome = nomeInput?.value || '';
            const descricao = descricaoInput?.value || '';
            const estado = 'pendente';

            if (!nome || !descricao) {
                return;
            }

            const auth = sessionStorage.getItem('auth');
            const user = auth ? JSON.parse(auth) : null;

            if (!user?.nome) {
                return;
            }

            let utilizador_id: number | null = user?.id || null;

            const ticketData: TicketData = { nome, descricao, estado, utilizador_id };

            try {
                const response = await fetch('http://192.168.1.14:3000/tickets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    },
                    body: JSON.stringify(ticketData)
                });

                const data = await response.json();

                if (response.ok) {
                    form.reset();
                    nomeInput?.focus();
                    setTimeout(() => {
                        const { ipcRenderer } = require('electron');
                        if (user?.permissions === "admin") {
                            console.log("Admin Login", user);
                            ipcRenderer.send('login-success-admin', user);
                        } else {
                            console.log("User Login", user);
                            ipcRenderer.send('login-success-user', user);
                        }
                    }, 100);

                }
            } catch (error) {
                console.error('Erro ao criar ticket:', error);
            }
        });
    }

    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    }
});
