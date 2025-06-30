// showTickets.ts
interface Ticket {
    id: number;
    nome: string;
    descricao: string;
    estado: string;
    utilizador_id: number | null;
    created_at: string;
  }
  
interface User {
    id: number;
    nome: string;
}
  
async function loadTickets() {
    const ticketsContainer = document.getElementById('tickets-container');

    if (!ticketsContainer) {
        console.error('Elemento tickets-container não encontrado!');
        return;
    }

    try {
        // Mostrar estado de carregamento
        ticketsContainer.innerHTML = '<div style="color: white; text-align: center; padding: 2rem;">Carregando tickets...</div>';

        // Busca os tickets
        const ticketsResponse = await fetch('http://192.168.1.14:3000/tickets', {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json'
        },
        });

        if (!ticketsResponse.ok) {
        throw new Error('Erro ao carregar tickets');
        }

        const tickets: Ticket[] = await ticketsResponse.json();

        tickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // Busca os nomes dos utilizadores
        const usersMap = await loadUsers(tickets);
        renderTickets(tickets, usersMap);

    } catch (error) {
        console.error('Erro ao carregar tickets:', error);
        const container = document.getElementById('tickets-container');
        if (container) {
        container.innerHTML = `
            <div style="color: white; text-align: center; padding: 2rem;">
            Erro ao carregar tickets: ${error instanceof Error ? error.message : 'Erro desconhecido'}
            <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: rgba(255,255,255,0.2); border: none; border-radius: 4px; color: white; cursor: pointer;">
                Tentar novamente
            </button>
            </div>
        `;
        }
    }
}

async function loadUsers(tickets: Ticket[]): Promise<Map<number, string>> {
    const usersMap = new Map<number, string>();
    const uniqueUserIds = [...new Set(tickets.map(t => t.utilizador_id).filter(Boolean))] as number[];

    await Promise.all(uniqueUserIds.map(async userId => {
        try {
        const userResponse = await fetch(`http://192.168.1.14:3000/users/${userId}`);
        if (userResponse.ok) {
            const user: User = await userResponse.json();
            usersMap.set(userId, user.nome);
        }
        } catch (error) {
        console.error(`Erro ao buscar utilizador ${userId}:`, error);
        }
    }));

    return usersMap;
}

function renderTickets(tickets: Ticket[], usersMap: Map<number, string>) {
    const container = document.getElementById('tickets-container');
    if (!container) return;

    if (tickets.length === 0) {
        container.innerHTML = '<div style="color: white; text-align: center; padding: 2rem;">Nenhum ticket encontrado</div>';
        return;
    }

    container.innerHTML = '';

    tickets.forEach(ticket => {
        const userName = ticket.utilizador_id ? usersMap.get(ticket.utilizador_id) || `ID ${ticket.utilizador_id}` : 'Sem utilizador';
        const auth = sessionStorage.getItem('auth');
        const permissoes = auth ? JSON.parse(auth).permissions : null;
        
        const ticketElement = document.createElement('div');
        ticketElement.className = 'ticket-item';
        ticketElement.style.cssText = `
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 1.5rem;
        margin: 1rem;
        backdrop-filter: blur(4px);
        border-left: 4px solid ${getColorByEstado(ticket.estado)};
        cursor: pointer;
        transition: all 0.2s ease;
        `;

        ticketElement.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.8rem;">
            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${getColorByEstado(ticket.estado)};"></div>
            <span style="color: rgba(0,0,0,1); text-transform: capitalize; font-weight: bold; min-width: 80px;">${ticket.estado}</span>
            <small style="color: rgba(0,0,0,1); font-weight: bold; min-width: 120px;">${formatDate(ticket.created_at)}</small>
            <small style="color: rgba(0,0,0,1); font-weight: bold; min-width: 100px;">Utilizador: ${userName}</small>
        </div>
        <div style="margin-bottom: 0.5rem;">
            <h3 style="margin: 0; font-weight: bold; color: rgba(0,0,0,1);">${ticket.nome}</h3>
        </div>
        <p style="margin: 0; color: rgba(0,0,0,1);">${ticket.descricao}</p>
        ${permissoes === 'admin' ? `
        <button onclick="window.location.href='ticket.html?id=${ticket.id}'"
            style="margin-top: 1rem; padding: 0.5rem 1rem; background: #1E90FF; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Ver mais
        </button>
        ` : ''}
        `;

        container.appendChild(ticketElement);
    });
}

function getColorByEstado(estado: string): string {
    const colors: Record<string, string> = {
        'aberto': '#90EE90',
        'em progresso': '#FFA500',
        'fechado': '#FF6347',
        'pendente': '#1E90FF'
    };
    return colors[estado.toLowerCase()] || '#CCCCCC';
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
  
document.addEventListener('DOMContentLoaded', () => {
    loadTickets();
    
    const refreshButton = document.getElementById('refresh-button');
    const adminPanelBtn = document.querySelector('.admin-panel-btn');
    const addTicket = document.getElementById('add-ticket-btn');
    if (refreshButton) {
      refreshButton.addEventListener('click', loadTickets);
    }
    if (adminPanelBtn) {
        adminPanelBtn.addEventListener('click', () => {
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('adminPanel');
        });
    }
    if (addTicket) {
        addTicket.addEventListener('click', () => {
            const { ipcRenderer } = require('electron');
            ipcRenderer.send('createTicket');
        })
    }
});