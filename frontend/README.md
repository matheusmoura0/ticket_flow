# Frontend TicketFlow

Este é o frontend da aplicação TicketFlow, uma interface moderna e responsiva para o sistema de venda de ingressos.

## Stack
- **React 19** com **TypeScript**
- **Vite** para build e desenvolvimento rápido
- **Tailwind CSS 4** para estilização
- **TanStack Query (React Query)** para gerenciamento de estado assíncrono
- **Axios** para requisições HTTP

## Configuração

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Rodar o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

3. **Build para Produção:**
   ```bash
   npm run build
   ```

## Estrutura do Projeto
- `src/components`: Componentes reutilizáveis
- `src/pages`: Páginas da aplicação
- `src/services`: Configuração do Axios e chamadas à API
- `src/hooks`: Custom hooks (incluindo React Query)

## Integração com Backend
O frontend espera que o backend esteja rodando em `http://localhost:3000`. Certifique-se de iniciar o backend antes de testar fluxos que dependem da API.
