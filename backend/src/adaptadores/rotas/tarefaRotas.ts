import { Router, Request, Response } from 'express';
import { CriarTarefaControlador } from '../controladores/CriarTarefaControlador';
import { ListarTarefasControlador } from '../controladores/ListarTarefasControlador';
import { BuscarTarefaControlador } from '../controladores/BuscarTarefaControlador';
import { AtualizarTarefaControlador } from '../controladores/AtualizarTarefaControlador';
import { ExcluirTarefaControlador } from '../controladores/ExcluirTarefaControlador';

export interface TarefaControllers {
	criarTarefaController: CriarTarefaControlador;
	listarTarefasController: ListarTarefasControlador;
	buscarTarefaController: BuscarTarefaControlador;
	atualizarTarefaController: AtualizarTarefaControlador;
	excluirTarefaController: ExcluirTarefaControlador;
}

/**
 * Esquemas esperados (garantir que estejam também em swaggerSpec.components.schemas):
 *
 * TarefaDTO:
 *  {
 *    id: number;
 *    titulo: string;
 *    descricao?: string;
 *    status: 'pendente' | 'em_andamento' | 'concluida';
 *    prioridade: 'baixa' | 'media' | 'alta';
 *    dataCriacao: string (ISO);
 *    dataAtualizacao: string (ISO);
 *    dataVencimento?: string | null (ISO);
 *  }
 *
 * CriarTarefaDTO (request):
 *  {
 *    titulo: string (required);
 *    descricao?: string;
 *    status?: 'pendente' | 'em_andamento' | 'concluida';
 *    prioridade?: 'baixa' | 'media' | 'alta';
 *    dataVencimento?: string (ISO date / datetime);
 *  }
 *
 * AtualizarTarefaDTO (request):
 *  {
 *    titulo?: string;
 *    descricao?: string;
 *    status?: 'pendente' | 'em_andamento' | 'concluida';
 *    prioridade?: 'baixa' | 'media' | 'alta';
 *    dataVencimento?: string | null;
 *  }
 */
export function montarTarefaRotas(ctrls: TarefaControllers): Router {
	const router = Router();

	/**
	 * @swagger
	 * tags:
	 *   - name: Tarefas
	 *     description: Operações CRUD de tarefas
	 */

	/**
	 * @swagger
	 * /api/tarefas:
	 *   post:
	 *     summary: Criar nova tarefa
	 *     description: Cria uma tarefa. Campos status e prioridade assumem valores padrão caso omitidos.
	 *     tags: [Tarefas]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/CriarTarefaDTO'
	 *           examples:
	 *             exemplo:
	 *               value:
	 *                 titulo: "Estudar POO"
	 *                 descricao: "Revisar encapsulamento"
	 *                 status: "pendente"
	 *                 prioridade: "media"
	 *                 dataVencimento: "2025-09-10"
	 *     responses:
	 *       201:
	 *         description: Tarefa criada
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/TarefaDTO'
	 *       400:
	 *         description: Erro de validação
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Erro'
	 *       500:
	 *         description: Erro interno
	 */
	router.post('/', (req: Request, res: Response) => ctrls.criarTarefaController.handle(req, res));

	/**
	 * @swagger
	 * /api/tarefas:
	 *   get:
	 *     summary: Listar tarefas
	 *     description: Retorna todas as tarefas cadastradas em ordem decrescente de criação (dependendo da implementação do repositório).
	 *     tags: [Tarefas]
	 *     responses:
	 *       200:
	 *         description: Lista retornada
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/TarefaDTO'
	 *       500:
	 *         description: Erro interno
	 */
	router.get('/', (req: Request, res: Response) => ctrls.listarTarefasController.handle(req, res));

	/**
	 * @swagger
	 * /api/tarefas/{id}:
	 *   get:
	 *     summary: Buscar tarefa por ID
	 *     tags: [Tarefas]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         schema:
	 *           type: integer
	 *         required: true
	 *         description: ID numérico da tarefa
	 *     responses:
	 *       200:
	 *         description: Tarefa encontrada
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/TarefaDTO'
	 *       404:
	 *         description: Tarefa não encontrada
	 *       500:
	 *         description: Erro interno
	 */
	router.get('/:id', (req: Request, res: Response) => ctrls.buscarTarefaController.handle(req, res));

	/**
	 * @swagger
	 * /api/tarefas/{id}:
	 *   put:
	 *     summary: Atualizar tarefa existente
	 *     tags: [Tarefas]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         schema:
	 *           type: integer
	 *         required: true
	 *         description: ID da tarefa
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/AtualizarTarefaDTO'
	 *           examples:
	 *             exemplo:
	 *               value:
	 *                 titulo: "Estudar POO - Capítulo 2"
	 *                 status: "em_andamento"
	 *                 prioridade: "alta"
	 *                 dataVencimento: "2025-09-15"
	 *     responses:
	 *       200:
	 *         description: Tarefa atualizada
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/TarefaDTO'
	 *       400:
	 *         description: Erro de validação
	 *       404:
	 *         description: Tarefa não encontrada
	 *       500:
	 *         description: Erro interno
	 */
	router.put('/:id', (req: Request, res: Response) => ctrls.atualizarTarefaController.handle(req, res));

	/**
	 * @swagger
	 * /api/tarefas/{id}:
	 *   delete:
	 *     summary: Excluir tarefa
	 *     tags: [Tarefas]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         schema:
	 *           type: integer
	 *         required: true
	 *         description: ID da tarefa
	 *     responses:
	 *       204:
	 *         description: Excluída sem conteúdo
	 *       404:
	 *         description: Tarefa não encontrada
	 *       500:
	 *         description: Erro interno
	 */
	router.delete('/:id', (req: Request, res: Response) => ctrls.excluirTarefaController.handle(req, res));

	return router;
}
