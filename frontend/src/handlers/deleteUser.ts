document.addEventListener('DOMContentLoaded', async () => {
    const userListContainer = document.getElementById('user-list-container');
    if (!userListContainer) {
        console.error('Required elements are missing from the DOM.');
        return;
    }

    async function loadUsers(container: HTMLElement) {
        let permissoes: string;
        try {
            const response = await fetch('http://192.168.1.14:3000/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load users');
            }

            const users: { id: string; nome: string; permissions: string }[] = await response.json();

            if (users.length === 0) {
                container.innerHTML = '<div class="loading">Nenhum utilizador encontrado</div>';
                return;
            }

            let userListHTML = '<ul class="user-list">';

            users.forEach(user => {
                permissoes = user.permissions === "user" ? "Utilizador" : "Administrador";
                userListHTML += `
                    <li class="user-item">
                        <div class="user-info">
                            <strong>${user.nome}</strong> (${permissoes})
                        </div>
                        <button class="delete-btn" data-id="${user.id}">Remover</button>
                    </li>
                `;
            });

            userListHTML += '</ul>';
            container.innerHTML = userListHTML;

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const target = e.target as HTMLButtonElement | null;
                    const userId = target?.getAttribute('data-id');

                    if (!userId) {
                        console.error('User ID not found.');
                        return;
                    }

                    try {
                        const deleteResponse = await fetch(`http://192.168.1.14:3000/users/${userId}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                            }
                        });

                        if (deleteResponse.ok) {
                            await loadUsers(container);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        container.innerHTML = '<div class="loading">Erro ao carregar utilizadores</div>';
                    }
                });
            });

        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = '<div class="loading">Erro ao carregar utilizadores</div>';
        }
    }

    document.getElementById('back-button')?.addEventListener('click', () => {
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('adminPanel');
    });

    await loadUsers(userListContainer);
});
