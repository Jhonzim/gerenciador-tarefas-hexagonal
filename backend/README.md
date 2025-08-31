# Projeto Backend – Gerenciador de Tarefas

Este documento descreve as etapas necessárias para configurar, compilar, testar e executar o backend do projeto.

---

## 1. Instalação

- Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
- No terminal, acesse a pasta `backend` e execute:

```
npm install
```

---

## 2. Configuração

- Se necessário, crie um arquivo `.env` na raiz do backend para suas variáveis de ambiente.
- Configure os dados do banco de dados, porta do servidor e outros valores conforme o ambiente.

---

## 3. Compilação

- Compile o projeto TypeScript executando:

```
npm run build
```

---

## 4. Execução

- Para rodar a aplicação compilada, execute:

```
npm start
```

- Para desenvolvimento (compilação em tempo real), utilize:

```
npm run dev
```

---

## 5. Testes

- Execute os testes utilizando:

```
npm test
```

- Certifique-se de que as definições de tipo do Jest estão instaladas:
  - Caso apareça o erro relacionado a `describe`, instale com:
  
  ```
  npm i --save-dev @types/jest
  ```
  
- Os testes estão localizados na pasta `src/aplicacao` (por exemplo, `TarefaServico.test.ts`).

---

## 6. Observações Gerais

- As rotas e os controladores utilizam tipagem do Express. Caso precise de ajustes, assegure que os objetos `Request` e `Response` sejam importados e tipados.
- O projeto utiliza a compilação com o TypeScript. Em caso de dúvidas sobre o arquivo `tsconfig.json`, verifique se as configurações estão de acordo com o ambiente do seu projeto.

---

## 7. Estrutura de Pastas

- `src/`: Código-fonte.
  - `adaptadores/rotas/`: Rotas do Express.
  - `adaptadores/controladores/`: Controladores responsáveis pelas regras de negócio.
  - `aplicacao/`: Serviços e testes.
  - `dominio/`: Entidades e interfaces (portas).

---

Após seguir essas instruções, seu backend estará pronto para ser utilizado e testado.
