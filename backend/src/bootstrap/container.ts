import 'dotenv/config';
import { criarConexao } from '../adaptadores/db/conexao';

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


const pool = criarConexao();
let tarefaRepositorio: ITarefaRepositorio = new MySQLTarefaRepositorio(pool);

const criarTarefaService = new CriarTarefaService(tarefaRepositorio);
const listarTarefasService = new ListarTarefasService(tarefaRepositorio);
const buscarTarefaService = new BuscarTarefaService(tarefaRepositorio);
const atualizarTarefaService = new AtualizarTarefaService(tarefaRepositorio);
const excluirTarefaService = new ExcluirTarefaService(tarefaRepositorio);

const criarTarefaController = new CriarTarefaControlador(criarTarefaService);
const listarTarefasController = new ListarTarefasControlador(listarTarefasService);
const buscarTarefaController = new BuscarTarefaControlador(buscarTarefaService);
const atualizarTarefaController = new AtualizarTarefaControlador(atualizarTarefaService);
const excluirTarefaController = new ExcluirTarefaControlador(excluirTarefaService);

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

export function substituirRepositorio(repo: ITarefaRepositorio) {
	tarefaRepositorio = repo;
	(container.services as any).criarTarefaService = new CriarTarefaService(tarefaRepositorio);
	(container.services as any).listarTarefasService = new ListarTarefasService(tarefaRepositorio);
	(container.services as any).buscarTarefaService = new BuscarTarefaService(tarefaRepositorio);
	(container.services as any).atualizarTarefaService = new AtualizarTarefaService(tarefaRepositorio);
	(container.services as any).excluirTarefaService = new ExcluirTarefaService(tarefaRepositorio);
	
	(container.controladores as any).criarTarefaController = new CriarTarefaControlador(container.services.criarTarefaService);
	(container.controladores as any).listarTarefasController = new ListarTarefasControlador(container.services.listarTarefasService);
	(container.controladores as any).buscarTarefaController = new BuscarTarefaControlador(container.services.buscarTarefaService);
	(container.controladores as any).atualizarTarefaController = new AtualizarTarefaControlador(container.services.atualizarTarefaService);
	(container.controladores as any).excluirTarefaController = new ExcluirTarefaControlador(container.services.excluirTarefaService);
}
