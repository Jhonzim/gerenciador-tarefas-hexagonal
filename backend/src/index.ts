import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { criarConexao, inicializarBancoDeDados } from './adaptadores/db/conexao';
import { MySQLTarefaRepositorio } from './adaptadores/repositorios/MySQLTarefaRepositorio';
import { TarefaServico } from './aplicacao/TarefaServico';
import { TarefaControlador } from './adaptadores/controladores/TarefaControlador';
import { criarTarefaRotas } from './adaptadores/rotas/tarefaRotas';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function iniciarServidor() {
  try {
    // Criar conexão com o banco de dados
    const conexao = await criarConexao();
    
    // Inicializar banco de dados
    await inicializarBancoDeDados(conexao);
    
    // Criar instâncias seguindo a arquitetura hexagonal
    const tarefaRepositorio = new MySQLTarefaRepositorio(conexao);
    const tarefaServico = new TarefaServico(tarefaRepositorio);
    const tarefaControlador = new TarefaControlador(tarefaServico);
    
    // Configurar rotas
    app.use('/api/tarefas', criarTarefaRotas(tarefaControlador));
    
    // Rota de teste
    app.get('/', (req, res) => {
      res.json({ mensagem: 'API de Gerenciamento de Tarefas está funcionando!' });
    });
    
    // Iniciar o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();
