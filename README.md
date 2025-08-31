# Gerenciador de Tarefas – Arquitetura Hexagonal (Ports & Adapters)

Aplicação CRUD simples de Tarefas para fins acadêmicos demonstrando POO, separação de camadas e documentação via Swagger.

![Arquitetura do Projeto](./Diagrama%20de%20arquitetura.png)

## 1. Justificativa da Arquitetura

Arquitetura Hexagonal escolhida para:
- Desacoplar núcleo de domínio de infraestrutura (banco, HTTP, bibliotecas).
- Facilitar testes isolados (mock de portas).
- Permitir substituição de adaptadores (ex.: trocar MySQL por outro).
- Evoluir facilmente (ex.: adicionar autenticação sem alterar domínio).
- Reduzir dependência acidental de frameworks.

## 2. Fluxo CRUD (Passo a Passo)

Exemplo (Criar Tarefa):
1. Cliente envia POST /api/tarefas.
2. Rota → chama Controlador.
3. Controlador valida/passa dados ao Serviço (TarefaServico).
4. Serviço cria entidade Tarefa e usa Porta ITarefaRepositorio.
5. Adaptador (MySQLTarefaRepositorio) executa SQL.
6. Retorna entidade → controlador serializa → resposta JSON.

Atualizar / Buscar / Listar / Excluir seguem o mesmo padrão mudando a operação no repositório.

Fluxo de dados (simplificado):

Cliente → (HTTP) Rotas → Controlador → Serviço (Caso de Uso) → Porta Repositório → Adaptador (MySQL) → Banco  
                                    ↑---------------- Entidade / Regras ----------------↑

## 3. Responsabilidades

- dominio/entidades/Tarefa.ts: Regra / invariantes de Tarefa.
- dominio/portas/ITarefaRepositorio.ts: Contrato de persistência.
- aplicacao/TarefaServico.ts: Casos de uso (coordenar operações).
- adaptadores/repositorios/MySQLTarefaRepositorio.ts: Implementação da porta via SQL.
- adaptadores/db/conexao.ts: Criação e bootstrap do schema.
- adaptadores/controladores/TarefaControlador.ts: Entrada HTTP.
- adaptadores/rotas/tarefaRotas.ts: Definição das rotas Express.
- index.ts: Composição (wiring) das dependências.
- tests (TarefaServico.test.ts): Testes de regras de aplicação.
- config/swagger.ts + anotações: Documentação automática.

## 4. Padrões de Projeto Aplicados

- Repository: Abstrai persistência (ITarefaRepositorio).
- Ports & Adapters: Hexagonal (portas = interfaces; adaptadores = implementações).
- Dependency Injection manual: Objetos criados e passados no index.ts.
- DTO implícito: Dados simples repassados entre camadas (poderia formalizar).
- Entity: Objeto de domínio com encapsulamento e métodos de modificação.

## 5. Conceitos de POO

- Encapsulamento: Propriedades privadas manipuladas por getters/setters na entidade Tarefa.
- Abstração: ITarefaRepositorio oculta detalhes de persistência.
- Polimorfismo: Possibilidade de múltiplos repositórios (ex.: EmMemoriaTarefaRepositorio futuro).
- Herança: Não utilizada (intencional — composição suficiente neste escopo).
- Imutabilidade parcial: Modificações sempre atualizam dataAtualizacao.

## 6. Instalação e Execução (Resumo)

Pré-requisitos: Node.js ≥14, Docker, npm.

Banco:
```
docker-compose up -d
```

Backend:
```
cd backend
cp .env.example .env
npm install
npm run dev
```

Frontend:
```
cd frontend
npm install
npm start
```

Swagger: http://localhost:5000/api/docs  
Frontend: http://localhost:3000

## 7. Variáveis de Ambiente (backend/.env)

```
PORT=5000
DB_HOST=localhost
DB_USER=tarefas_user
DB_PASSWORD=tarefas_password
DB_DATABASE=tarefas_db
```

Configurar antes de iniciar o backend.

## 8. Endpoints Principais

Base: /api/tarefas

| Método | Rota        | Descrição          | Status |
|--------|-------------|--------------------|--------|
| POST   | /           | Criar tarefa       | 201    |
| GET    | /           | Listar tarefas     | 200    |
| GET    | /:id        | Buscar por id      | 200/404|
| PUT    | /:id        | Atualizar tarefa   | 200/404|
| DELETE | /:id        | Excluir tarefa     | 204/404|

## 9. Exemplos (cURL)

Criar:
```
curl -X POST http://localhost:5000/api/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Estudar POO","descricao":"Rever encapsulamento","status":"pendente","prioridade":"media"}'
```

Listar:
```
curl http://localhost:5000/api/tarefas
```

Atualizar:
```
curl -X PUT http://localhost:5000/api/tarefas/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"concluida","prioridade":"alta"}'
```

Excluir:
```
curl -X DELETE http://localhost:5000/api/tarefas/1
```

## 10. Documentação Swagger

- Gera schemas (Tarefa, CriarTarefaInput, AtualizarTarefaInput).
- Atualizar doc: editar comentários JSDoc em adaptadores/rotas/tarefaRotas.ts ou schemas em config/swagger.ts.
- Acessar: /api/docs

## 11. Testes

Rodar:
```
cd backend
npm test
```

Cobertura atual: foco em serviço (TarefaServico).  
Futuro: adicionar testes de integração (supertest) cobrindo rotas e banco (ambiente temporário).

## 12. Tratamento de Erros e Validação (Estado Atual)

- Validação mínima (apenas título obrigatório).
- Erros genéricos retornam 500.
- Próximo passo recomendado: camada de validação (ex.: Zod / custom), padronizar resposta: `{ mensagem, codigo }`.
- Mapear: 400 (entrada inválida), 404 (não encontrado).

## 13. Estrutura (Detalhada)

```
backend/
  src/
    dominio/
      entidades/           # Entidades de negócio
      portas/              # Interfaces (contracts)
    aplicacao/
      TarefaServico.ts     # Casos de uso
      TarefaServico.test.ts
    adaptadores/
      controladores/       # Controladores Express
      repositorios/        # Repositório MySQL
      rotas/               # Rotas HTTP
      db/                  # Conexão + bootstrap SQL
    config/
      swagger.ts           # Config OpenAPI
    index.ts               # Composição
frontend/
  src/
    componentes/
    servicos/
    tipos/
    ...
```

## 14. Checklist (Autoavaliação)

| Item                                                   | Status | Observação |
|--------------------------------------------------------|--------|------------|
| Arquitetura explicada e justificada                    | OK     | Seção 1    |
| Fluxo CRUD detalhado                                   | OK     | Seção 2    |
| Responsabilidades mapeadas                             | OK     | Seção 3    |
| Padrões descritos                                      | OK     | Seção 4    |
| Estrutura de pastas clara                              | OK     | Seção 13   |
| Documentação básica (.env, execução)                   | OK     | Seções 6–8 |
| Exemplos de uso                                        | OK     | Seção 9    |
| Swagger disponível                                     | OK     | Seção 10   |
| Conceitos POO explicados                               | OK     | Seção 5    |
| Tratamento de erros robusto                            | PEND   | Implementar validação e mapeamento HTTP |
| Validação de dados                                     | PEND   | Criar camada / middleware |
| Testes integração                                      | PEND   | Adicionar supertest |
| Cobertura ampliada                                     | PEND   | Medir e ampliar |
| Versionamento Git (documentado)                        | PEND   | Adicionar seção de convenções |
| Interface mínima (frontend)                            | OK     | CRUD React |
| Uso de IA (menção)                                     | PEND   | Adicionar nota opcional |

## 15. Pendências Recomendadas

1. Validação de entrada: criar um validador (ex.: função validarTarefaDTO) antes de chamar o serviço.
2. Padronizar erros: criar classe ErroAplicacao e mapeamento (middleware) para status.
3. Testes de integração: usar supertest para endpoints reais (banco isolado ou mock).
4. Cobertura: adicionar script `npm run test:coverage`.
5. Logs estruturados: console substituível por pino/winston.
6. Versionamento: descrever convenção de commits (ex.: Conventional Commits) no README.
7. Camada DTO explícita: separar modelos de entrada/saída.
8. Variáveis no frontend: mover baseURL para REACT_APP_API_URL.
9. Script de seed opcional.
10. Dockerfile para backend e frontend (deploy futuro).

## 16. Próximos Passos (Resumo de Ação)

| Passo | Ação |
|-------|------|
| 1 | Implementar validação de payload antes do serviço |
| 2 | Criar middleware de erro padronizado |
| 3 | Adicionar testes de integração (supertest) |
| 4 | Criar script coverage e medir lacunas |
| 5 | Documentar convenção Git/commits |
| 6 | Externalizar baseURL (frontend .env) |
| 7 | Adicionar DTOs explícitos (entrada/saída) |
| 8 | Melhorar mensagens de erro (i18n opcional) |

## 17. Conclusão

Núcleo desacoplado, CRUD funcional, documentação disponível e base pronta para evoluções (auth, filtros, paginação). Pendências concentram-se em robustez (validação, erros, testes).
