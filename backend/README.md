# Backend TicketFlow

Este é o backend da aplicação TicketFlow, um sistema de venda de ingressos de alta concorrência.

## Stack
- Ruby 3.x
- Rails 8.x
- PostgreSQL
- Redis / Sidekiq

## Configuração

1. **Instalar dependências:**
   ```bash
   bundle install
   ```

2. **Configuração do Banco de Dados:**
   ```bash
   rails db:create db:migrate db:seed
   ```

3. **Rodar o Servidor:**
   ```bash
   bin/rails s
   ```

## Serviços Externos/Internos
- **Redis**: Necessário para o Sidekiq (processamento de jobs em segundo plano).

## Documentação da API (Swagger)

A API é documentada usando Swagger/OpenAPI.

### Visualizando a Documentação
1. Inicie o servidor: `bin/rails s`
2. Acesse: **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Atualizando a Documentação
Se você fizer alterações na API, atualize as specs em `spec/requests/api` e gere novamente o arquivo Swagger:

```bash
rails rswag:specs:swaggerize
```
