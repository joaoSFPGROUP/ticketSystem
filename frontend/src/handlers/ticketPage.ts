interface Ticket {
    id: number;
    nome: string;
    descricao: string;
    estado: string;
    utilizador_id: number | null;
    created_at: string;
}
  
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const ticketId = params.get('id');
    const container = document.getElementById('ticket-details');
  
    if (!ticketId || !container) return;
  
    try {
      const response = await fetch(`http://192.168.1.14:3000/tickets/${ticketId}`);
      if (!response.ok) throw new Error('Ticket não encontrado');
  
      const ticket: Ticket = await response.json();
  
      container.innerHTML = `
        <h2><strong>Nome do ticket:</strong> ${ticket.nome}</h2>
        <p><strong>Descrição:</strong> ${ticket.descricao}</p>
        <p><strong>Estado atual:</strong> ${ticket.estado}</p>
        <p><strong>Criado em:</strong> ${new Date(ticket.created_at).toLocaleString()}</p>
  
        <label for="estado">Mudar estado:</label>
        <select id="estado">
          <option value="pendente">Pendente</option>
          <option value="aberto">Aberto</option>
          <option value="em progresso">Em Progresso</option>
          <option value="fechado">Fechado</option>
        </select>
  
        <div style="margin-top: 1rem;">
          <button id="save-btn" style="padding: 0.5rem; margin-right: 1rem; border: 5px; border-radius: 8px;">Salvar</button>
          <button id="delete-btn" style="padding: 0.5rem; border: 5px; border-radius: 8px;">Eliminar</button>
        </div>
      `;
  
      const estadoSelect = document.getElementById('estado') as HTMLSelectElement;
      estadoSelect.value = ticket.estado;
  
      document.getElementById('save-btn')?.addEventListener('click', async () => {
        const novoEstado = estadoSelect.value;
  
        const updateRes = await fetch(`http://192.168.1.14:3000/tickets/${ticket.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: novoEstado })
        });
  
        if (updateRes.ok) {
          location.reload();
        }
      });
  
      document.getElementById('delete-btn')?.addEventListener('click', async () => {
        const deleteRes = await fetch(`http://192.168.1.14:3000/tickets/${ticket.id}`, {
          method: 'DELETE'
        });
  
        if (deleteRes.ok) {
            const auth = sessionStorage.getItem('auth');
            const user = auth ? JSON.parse(auth) : null;
            const { ipcRenderer } = require('electron');
            if (user?.permissions === "admin") {
                console.log("Admin Login", user);
                ipcRenderer.send('login-success-admin', user);
            } else {
                console.log("User Login", user);
                ipcRenderer.send('login-success-user', user);
            }
        }
      });
  
    } catch (error) {
      container.innerHTML = `<p>Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}</p>`;
    }

    document.getElementById('back-button')?.addEventListener('click', () => {
        const auth = sessionStorage.getItem('auth');
        const user = auth ? JSON.parse(auth) : null;
        const { ipcRenderer } = require('electron');
        if (user?.permissions === "admin") {
            console.log("Admin Login", user);
            ipcRenderer.send('login-success-admin', user);
        } else {
            console.log("User Login", user);
            ipcRenderer.send('login-success-user', user);
        }
    });
});
  