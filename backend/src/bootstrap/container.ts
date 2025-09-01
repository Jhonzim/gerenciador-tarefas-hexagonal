import 'dotenv/config';
import { createPool, Pool } from 'mysql2/promise';

import { ITarefaRepositorio } from '../dominio/portas/ITarefaRepositorio';
import { MySQLTarefaRepositorio } from '../adaptadores/repositorios/MySQLTarefaRepositorio';

import { CriarTarefaService } from '../aplicacao/servicos/CriarTarefaService';
import { ListarTarefasService } from '../aplicacao/servicos/ListarTarefasService';
import { BuscarTarefaService } from '../aplicacao/servicos/BuscarTarefaService';
import { AtualizarTarefaService } from '../aplicacao/servicos/AtualizarTarefaService';
import { ExcluirTarefaService } from '../aplicacao/servicos/ExcluirTarefaService';

import { CriarTarefaControlador } from '../adaptadores/controladores/CriarTarefaControlador';
import { ListarTarefasControlador } from '../adaptadores/controladores/ListarTarefasControlador';
import { BuscarTarefaControlador } from '../adaptadores/controladores/BuscarTarefaControlador';
import { AtualizarTarefaControlador } from '../adaptadores/controladores/AtualizarTarefaControlador';
import { ExcluirTarefaControlador } from '../adaptadores/controladores/ExcluirTarefaControlador';

import '../config/timezone';

// -----------------------------------------------------------------------------
// Pool MySQL (garanta que mysql2 esteja instalado: npm i mysql2)
// -----------------------------------------------------------------------------
let pool: Pool;
try {
	pool = createPool({
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
		user: process.env.DB_USER || 'root',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_DATABASE || 'tarefas_db',
		waitForConnections: true,
		connectionLimit: 10
	});
	(async () => {
		try {
			const c = await pool.getConnection();
			await c.ping();
			c.release();
			console.log('[DB] Conectado ao MySQL');
		} catch (err: any) {
			console.warn('[DB] Falha no ping inicial:', err?.message);
		}
	})();
} catch (err: any) {
	console.error('[DB] Erro criando pool:', err?.message);
	throw err;
}

// pool.query("SET time_zone = 'America/Sao_Paulo'").catch(e => console.warn('[DB] Falha ao setar time_zone:', e.message));

// -----------------------------------------------------------------------------
// Repositório (se quiser fallback em memória, adicione aqui uma classe alternativa)
// -----------------------------------------------------------------------------
let tarefaRepositorio: ITarefaRepositorio = new MySQLTarefaRepositorio(pool);

// -----------------------------------------------------------------------------
// Services
// -----------------------------------------------------------------------------
const criarTarefaService = new CriarTarefaService(tarefaRepositorio);
const listarTarefasService = new ListarTarefasService(tarefaRepositorio);
const buscarTarefaService = new BuscarTarefaService(tarefaRepositorio);
const atualizarTarefaService = new AtualizarTarefaService(tarefaRepositorio);
const excluirTarefaService = new ExcluirTarefaService(tarefaRepositorio);

// -----------------------------------------------------------------------------
// Controladores
// -----------------------------------------------------------------------------
const criarTarefaController = new CriarTarefaControlador(criarTarefaService);
const listarTarefasController = new ListarTarefasControlador(listarTarefasService);
const buscarTarefaController = new BuscarTarefaControlador(buscarTarefaService);
const atualizarTarefaController = new AtualizarTarefaControlador(atualizarTarefaService);
const excluirTarefaController = new ExcluirTarefaControlador(excluirTarefaService);

// -----------------------------------------------------------------------------
// Export do container
// -----------------------------------------------------------------------------
export const container = {
	db: { pool },
	repositorios: { tarefaRepositorio },
	services: {
		criarTarefaService,
		listarTarefasService,
		buscarTarefaService,
		atualizarTarefaService,
		excluirTarefaService
	},
	controladores: {
		criarTarefaController,
		listarTarefasController,
		buscarTarefaController,
		atualizarTarefaController,
		excluirTarefaController
	}
};

// -----------------------------------------------------------------------------
// Função de substituição de repositório (ex.: trocar para mock em testes)
// -----------------------------------------------------------------------------
export function substituirRepositorio(repo: ITarefaRepositorio) {
	tarefaRepositorio = repo;
	// Reinstancia services com novo repo
	(container.services as any).criarTarefaService = new CriarTarefaService(tarefaRepositorio);
	(container.services as any).listarTarefasService = new ListarTarefasService(tarefaRepositorio);
	(container.services as any).buscarTarefaService = new BuscarTarefaService(tarefaRepositorio);
	(container.services as any).atualizarTarefaService = new AtualizarTarefaService(tarefaRepositorio);
	(container.services as any).excluirTarefaService = new ExcluirTarefaService(tarefaRepositorio);
	// Reinstancia controladores
	(container.controladores as any).criarTarefaController = new CriarTarefaControlador(container.services.criarTarefaService);
	(container.controladores as any).listarTarefasController = new ListarTarefasControlador(container.services.listarTarefasService);
	(container.controladores as any).buscarTarefaController = new BuscarTarefaControlador(container.services.buscarTarefaService);
	(container.controladores as any).atualizarTarefaController = new AtualizarTarefaControlador(container.services.atualizarTarefaService);
	(container.controladores as any).excluirTarefaController = new ExcluirTarefaControlador(container.services.excluirTarefaService);
}
