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

## Atualizações Recentes (Refatoração)

Resumo das melhorias aplicadas para reforçar SRP (Single Responsibility) e clareza arquitetural:
- Serviços divididos: um service por ação (Criar / Listar / Buscar / Atualizar / Excluir) implementando interface genérica `IAcaoTarefa<TEntrada, TSaida>` com método `execute`.
- Controladores independentes: um controlador por ação (`CriarTarefaControlador`, etc.) apenas orquestra entrada/saída.
- DTOs introduzidos: `TarefaDTO`, `CriarTarefaDTO`, `AtualizarTarefaDTO` padronizam contrato externo (datas em string ISO).
- Mapper (`TarefaMapper`): conversão segura Entidade -> DTO (centraliza formatação).
- Fábrica (`TarefaFabrica`): ponto único de criação de `Tarefa` aplicando defaults (status/prioridade) e parsing de datas.
- Container (`src/bootstrap/container.ts`): composition root simples (instancia pool MySQL, repositório, services, controllers).
- Rotas desacopladas (`tarefaRotas.ts`): apenas mapeiam endpoints para controladores.
- Swagger enriquecido: anotações completas nos endpoints, esquemas alinhados aos DTOs.
- Validação básica: (caso mantenha) classe `ValidadorTarefa` para checagem de payload (título, enums). Próximo passo: substituir por lib (Zod / Yup) para mensagens mais ricas.
- Tratamento de erros: classe `ErroAplicacao` para diferenciar erros conhecidos de 500 genérico.
- Frontend adaptável: uso de `REACT_APP_API_URL` e consumo dos DTOs sem conhecer entidade interna.

## Estrutura do Projeto (Atualizada)

```
backend/
  src/
    index.ts                     # Express inicial (monta middlewares e usa rotas)
    bootstrap/
      container.ts               # Instancia repositório, services, controllers
    adaptadores/
      rotas/
        tarefaRotas.ts
      controladores/
        CriarTarefaControlador.ts
        ListarTarefasControlador.ts
        BuscarTarefaControlador.ts
        AtualizarTarefaControlador.ts
        ExcluirTarefaControlador.ts
      repositorios/
        MySQLTarefaRepositorio.ts
      db/
        conexao.ts               # Pool e init de schema (se usado)
    aplicacao/
      servicos/
        IAcaoTarefa.ts
        CriarTarefaService.ts
        ListarTarefasService.ts
        BuscarTarefaService.ts
        AtualizarTarefaService.ts
        ExcluirTarefaService.ts
      dtos/
        TarefaDTO.ts             # DTOs + Mapper (se separado mover para mapeadores/)
      mapeadores/
        TarefaMapper.ts
    dominio/
      entidades/
        Tarefa.ts
      fabricas/
        TarefaFabrica.ts
      portas/
        ITarefaRepositorio.ts
      erros/
        ErroAplicacao.ts
    config/
      swagger.ts
frontend/
  src/
    servicos/api.ts              # Cliente HTTP + tipos DTO
```

## DTOs e Mapper

Por que DTO?
- Estabiliza o contrato externo mesmo que a entidade mude internamente.
- Simplifica serialização (datas -> ISO).
- Evita vazamento de detalhes de implementação (propriedades internas / métodos).

Principais:
- `TarefaDTO`: shape externo completo.
- `CriarTarefaDTO`: entrada para criação (sem id, sem timestamps).
- `AtualizarTarefaDTO`: entrada parcial + id.
- `TarefaMapper.toDTO(entidade)`: converte entidade para DTO.

## Fábrica (TarefaFabrica)

Centraliza a criação de entidades aplicando:
- Defaults (`status = 'pendente'`, `prioridade = 'media'`).
- Conversão de `dataVencimento` (string -> Date).
- Facilita futuras regras (ex.: normalizar título).

## Serviços (Services)

Cada caso de uso isolado:
- CriarTarefaService.execute(CriarTarefaDTO) -> TarefaDTO
- ListarTarefasService.execute(void) -> TarefaDTO[]
- BuscarTarefaService.execute(id) -> TarefaDTO
- AtualizarTarefaService.execute(AtualizarTarefaDTO) -> TarefaDTO
- ExcluirTarefaService.execute(id) -> void

Benefícios:
- Testes unitários simples (mock só do repositório).
- Adoção de interface `IAcaoTarefa` padroniza invocação.

## Controladores

Funções únicas:
- Validar/parsing leve (ideal mover tudo para camada de validação).
- Chamar serviço (execute).
- Retornar resposta HTTP.

Não contêm regras de negócio.

## Validação

Estado atual:
- Validação mínima (ex.: título, enums).
Recomendado:
- Introduzir schema (Zod):
  - Declarar: `const criarSchema = z.object({ titulo: z.string().min(1), status: z.enum([...]).optional() })`
  - Integrar middleware antes do controlador.
- Padronizar resposta de erro: `{ mensagem, campo, codigo }`.

## Erros

`ErroAplicacao`:
- `status` HTTP configurável.
- Fábricas estáticas (ex.: `ErroAplicacao.naoEncontrado()`).
- Middleware global mapeia para JSON.

## Swagger (Documentação)

Acesso: `GET /api/docs`

Esquemas esperados:
- `TarefaDTO`
- `CriarTarefaDTO`
- `AtualizarTarefaDTO`
- `Erro`

Para adicionar novos endpoints:
1. Criar controlador + service.
2. Anotar rota com bloco `@swagger`.
3. Atualizar schemas em `config/swagger.ts` se necessário.

## Fluxo (Exemplo Criar)

HTTP POST /api/tarefas ->
Controlador (extrai body) ->
Fábrica cria Entidade ->
Repositório persiste ->
Service retorna Entidade ->
Mapper -> DTO ->
Resposta JSON 201.

## Adaptação do Frontend

- Centralizar chamadas em `frontend/src/servicos/api.ts`.
- Usar `REACT_APP_API_URL` no `.env`.
- Converter `dataVencimento` para `input[type=date]` via substring (0,10).
- Atualizações parciais: enviar só campos alterados.
- Tratar erros: `e.response?.data.mensagem`.

## Próximos Passos Recomendados

1. Substituir validação manual por Zod.
2. Adicionar testes de integração (Supertest) para garantir contrato.
3. Script de cobertura (`"test:coverage": "jest --coverage"`).
4. Paginação e filtros (query params).
5. Autenticação (camada extra de adaptador de entrada).
6. Logs estruturados (pino/winston).
7. Remover código legado (qualquer serviço monolítico).

## Checklist (Atualizado)

| Item | Status |
|------|--------|
| Serviços isolados (SRP) | OK |
| DTO / Mapper | OK |
| Fábrica de entidade | OK |
| Container de composição | OK |
| Swagger atualizado | OK |
| Validação robusta | PEND |
| Testes integração | PEND |
| Padronização erros detalhados | PEND |
| Paginação / filtros | PEND |
| Autenticação | PEND |
