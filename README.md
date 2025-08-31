# Gerenciador de Tarefas

Este projeto é um sistema de gerenciamento de tarefas desenvolvido como trabalho acadêmico para a disciplina de Programação Orientada a Objetos. O sistema permite criar, listar, atualizar e excluir tarefas, utilizando uma arquitetura hexagonal para promover uma separação clara de responsabilidades e facilitar a manutenção e testes.

## Arquitetura Utilizada

![Arquitetura do Projeto](./Diagrama%20de%20arquitetura.png)

O projeto adota a **Arquitetura Hexagonal** (também conhecida como Ports and Adapters), que visa isolar o núcleo da aplicação (domínio) das preocupações externas, como interfaces de usuário, bancos de dados e serviços externos. Essa arquitetura é dividida em três camadas principais:

### 1. Domínio (Núcleo da Aplicação)
- **Entidades**: Representam os objetos de negócio, como `Tarefa`.
- **Portas (Interfaces)**: Definem contratos para interações externas, como `ITarefaRepositorio`.
- Esta camada contém a lógica de negócio pura, independente de frameworks ou tecnologias específicas.

### 2. Aplicação
- **Casos de Uso (Serviços)**: Implementam a lógica de aplicação, como `TarefaServico`, que coordena as operações entre o domínio e as portas.
- Esta camada orquestra as regras de negócio e interage com as portas para acessar recursos externos.

### 3. Adaptadores (Infraestrutura)
- **Adaptadores de Entrada**: Lidam com requisições externas, como controladores HTTP (`TarefaControlador`) e rotas (`tarefaRotas`).
- **Adaptadores de Saída**: Implementam as portas, como repositórios (`MySQLTarefaRepositorio`) e conexões com bancos de dados.
- Esta camada conecta o núcleo da aplicação a tecnologias específicas, como Express, MySQL e Axios.

A arquitetura hexagonal permite:
- Facilidade para testes unitários e de integração.
- Substituição de tecnologias (ex.: trocar MySQL por PostgreSQL) sem afetar o domínio.
- Separação clara entre responsabilidades, tornando o código mais modular e sustentável.

## Tecnologias Utilizadas

- **Backend**:
  - Linguagem: TypeScript
  - Framework: Express.js
  - Banco de Dados: MySQL (via Docker)
  - Arquitetura: Hexagonal
  - Testes: Jest

- **Frontend**:
  - Linguagem: TypeScript
  - Framework: React
  - Biblioteca HTTP: Axios
  - Estilização: CSS puro

- **Infraestrutura**:
  - Docker: Para containerização do MySQL
  - Docker Compose: Para orquestração de serviços

## Estrutura do Projeto

```
backend
├── src
│   ├── dominio
│   │   ├── entidades
│   │   │   └── Tarefa.ts
│   │   └── repositorios
│   │       └── ITarefaRepositorio.ts
│   ├── aplicacao
│   │   └── servicos
│   │       └── TarefaServico.ts
│   └── infraestrutura
│       ├── bancoDados
│       │   └── MySQLTarefaRepositorio.ts
│       └── web
│           ├── controladores
│           │   └── TarefaControlador.ts
│           └── rotas
│               └── tarefaRotas.ts
└── package.json
frontend
├── src
│   ├── componentes
│   │   └── TarefaFormulario.tsx
│   ├── paginas
│   │   └── Home.tsx
│   └── App.tsx
└── package.json
docker-compose.yml
```

## Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 14 ou superior)
- Docker e Docker Compose
- npm ou yarn

### Passos para Execução

1. **Clone ou baixe o projeto**:
   - Navegue até a pasta raiz do projeto: `c:\Users\Joao\Desktop\Faculdade\Projeto Orientado a Objetos\AppTarefasPOO`

2. **Configure o banco de dados**:
   - Inicie o MySQL via Docker:
     ```
     docker-compose up -d
     ```
   - Isso criará um container com MySQL rodando na porta 3306.

3. **Configure o backend**:
   - Navegue para a pasta `backend`:
     ```
     cd backend
     ```
   - Instale as dependências:
     ```
     npm install
     ```
   - Execute o backend:
     ```
     npm run dev
     ```
   - O backend estará rodando em `http://localhost:5000`.

4. **Configure o frontend**:
   - Abra um novo terminal e navegue para a pasta `frontend`:
     ```
     cd ../frontend
     ```
   - Instale as dependências:
     ```
     npm install
     ```
   - Execute o frontend:
     ```
     npm start
     ```
   - O frontend estará rodando em `http://localhost:3000`.

5. **Acesse a aplicação**:
   - Abra o navegador e vá para `http://localhost:3000` para usar a interface web.

### Executando Testes

- Para o backend, navegue para a pasta `backend` e execute:
  ```
  npm test
  ```
- Para o frontend, navegue para a pasta `frontend` e execute:
  ```
  npm test
  ```

