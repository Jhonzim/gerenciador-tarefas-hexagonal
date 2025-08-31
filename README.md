# Gerenciador de Tarefas

Aplicação simples de gerenciamento de tarefas (criar, listar, atualizar, excluir) usando TypeScript, arquitetura Hexagonal (Ports & Adapters), Express, MySQL (Docker) e React.

## Arquitetura (Hexagonal)
![Arquitetura do Projeto](./Diagrama%20de%20arquitetura.png)
- Dominio: Entidades e portas (interfaces) puras (ex.: Tarefa, ITarefaRepositorio).
- Aplicacao: Casos de uso / serviços (ex.: TarefaServico) orquestram regras.
- Adaptadores:
  - Entrada: Controladores + Rotas Express.
  - Saída: Repositório MySQL e camada de conexão.
- Infraestrutura: Docker Compose para banco e phpMyAdmin.

Essa estrutura permite trocar o banco, adicionar autenticação ou outra interface sem alterar o núcleo.

## Tecnologias

Backend: Node.js, TypeScript, Express, MySQL (mysql2), Jest  
Frontend: React + TypeScript + Axios  
Infra: Docker / Docker Compose  

## Estrutura do Projeto

Abaixo uma visão detalhada das pastas para facilitar manutenção e expansão futura:

```
AppTarefasPOO/
├── docker-compose.yml
├── README.md
├── .gitignore
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── src/
│   │   ├── index.ts                 # Bootstrap do servidor Express
│   │   ├── dominio/                 # Núcleo (enterprise rules)
│   │   │   ├── entidades/           # Entidades de domínio (Tarefa.ts, etc.)
│   │   │   └── portas/              # Interfaces (ex.: ITarefaRepositorio.ts)
│   │   ├── aplicacao/               # Casos de uso / serviços de aplicação
│   │   │   ├── TarefaServico.ts
│   │   │   └── __tests__/           # Testes unitários focados em regras de aplicação
│   │   ├── adaptadores/             # Adapters (infra / entrada / saída)
│   │   │   ├── controladores/       # Controladores HTTP (TarefaControlador.ts)
│   │   │   ├── rotas/               # Definições de rotas Express
│   │   │   ├── repositorios/        # Implementações concretas (MySQLTarefaRepositorio.ts)
│   │   │   ├── db/                  # Conexão e inicialização do banco
│   │   │   └── mapeamentos/         # (Opcional futuro) ORMs / mapeamentos adicionais
│   │   ├── configuracao/            # (Opcional) Config helpers, loaders
│   │   └── shared/                  # (Opcional) Tipos utilitários / helpers genéricos
│   └── dist/                        # (Gerado) Código compilado
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   │   └── index.html               # Template raiz
│   ├── src/
│   │   ├── index.tsx                # Entrada React
│   │   ├── App.tsx
│   │   ├── componentes/             # Componentes reutilizáveis (ex.: ListaTarefas, FormularioTarefa)
│   │   ├── paginas/                 # (Opcional) Páginas se usar roteamento
│   │   ├── servicos/                # Consumo de APIs (api.ts)
│   │   ├── tipos/                   # Definições TypeScript (ex.: Tarefa.ts)
│   │   ├── estilos/                 # (Opcional) CSS modular / theme
│   │   ├── hooks/                   # (Opcional) Hooks customizados
│   │   ├── context/                 # (Opcional) Context API (ex.: auth futuramente)
│   │   └── utils/                   # (Opcional) Funções utilitárias
│   ├── build/                       # (Gerado) Build de produção
│
├── docs/                            # (Opcional) Documentação extra
│   └── arquitetura.md
└── scripts/                         # (Opcional) Scripts auxiliares (seed, migrate, etc.)
```

### Convenções

- dominio não importa nada de adaptadores.
- aplicacao só conhece dominio e portas.
- adaptadores implementam portas e expõem HTTP.
- Repositórios ficam em adaptadores/repositorios e recebem dependências explícitas (injeção manual).
- Testes unitários preferencialmente próximos aos casos de uso (`src/aplicacao/__tests__`).

### Possíveis diretórios futuros

| Diretório            | Uso Futuro                                                        |
|----------------------|-------------------------------------------------------------------|
| backend/src/eventos  | Integração assíncrona / domain events                             |
| backend/src/jobs     | Tarefas agendadas (cron)                                          |
| frontend/src/testes  | Testes de componentes / integração                                |
| frontend/src/theme   | Centralizar tokens de design                                     |

## Passo a Passo (IMPORTANTE: Configurar .env antes de executar)

### 1. Subir banco (Docker)

```bash
docker-compose up -d
```

### 2. Configurar variáveis de ambiente

Dentro de backend:

```bash
cp .env.example .env
```

Edite `.env` se necessário (PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE). Sem esse arquivo o backend não conecta ao banco.

### 3. Instalar e rodar backend

```bash
cd backend
npm install
npm run dev
```

API em: http://localhost:5000

### 4. Instalar e rodar frontend

```bash
cd frontend
npm install
npm start
```

Frontend em: http://localhost:3000

### 5. Testes (backend)

```bash
cd backend
npm test
```

(Jest configurado; testes não bloqueiam execução da aplicação.)

## Endpoints Principais (Backend)

Base: /api/tarefas  
- POST /  -> criar tarefa  
- GET /   -> listar tarefas  
- GET /:id -> buscar tarefa  
- PUT /:id -> atualizar tarefa  
- DELETE /:id -> remover tarefa  

Payload exemplo (POST / PUT):
```json
{
  "titulo": "Estudar POO",
  "descricao": "Revisar conceitos",
  "status": "pendente",
  "prioridade": "media",
  "dataVencimento": "2025-09-10"
}
```

## Scripts Úteis

Backend:
- npm run dev: desenvolvimento (ts-node-dev)
- npm run build: compila para dist
- npm start: executa compilado
- npm test: testes

Frontend:
- npm start: desenvolvimento
- npm run build: build produção

## Variáveis (.env backend)

```
PORT=5000
DB_HOST=localhost
DB_USER=tarefas_user
DB_PASSWORD=tarefas_password
DB_DATABASE=tarefas_db
```

## Possíveis Próximas Extensões

- Autenticação / usuários
- Filtros e paginação
- Logs estruturados
- Dockerfile para produção

## Resumo

1. docker-compose up -d  
2. Copiar .env.example para .env no backend  
3. Instalar dependências backend + frontend  
4. Rodar backend e depois frontend  

Projeto acadêmico demonstrando separação de camadas com arquitetura hexagonal.
  ```
  npm test
  ```

