# Ticket System

Este repositório contém um sistema de gestão de tickets desenvolvido inteiramente em TypeScript, com Electron no frontend (aplicação desktop) e Fastify no backend. Os dados são armazenados localmente usando SQLite3, e todas as atualizações são feitas via comunicação HTTP, sem uso de WebSockets.

⚙️ Funcionalidades principais:
📌 Criação de tickets com estado inicial pendente

👤 Associação dos tickets ao nome do utilizador (armazenado via sessionStorage)

🔄 Atualização da lista de tickets através de chamadas HTTP REST

🔐 Autenticação simples para uso interno

🖥️ Aplicação desktop construída com Electron e TypeScript

⚡ Backend leve com Fastify, também em TypeScript

🗃️ Armazenamento local com SQLite3

🛠️ Tecnologias utilizadas:
Frontend: Electron + TypeScript + HTML + CSS

Backend: Node.js + Fastify + TypeScript

Base de dados: SQLite3
