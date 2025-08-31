import { Router, Request, Response } from 'express';
import { TarefaControlador } from '../controladores/TarefaControlador';

export function criarTarefaRotas(tarefaControlador: TarefaControlador): Router {
  const router = Router();

  /**
   * @swagger
   * /api/tarefas:
   *   post:
   *     tags: [Tarefas]
   *     summary: Criar nova tarefa
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CriarTarefaInput'
   *     responses:
   *       201:
   *         description: Tarefa criada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Tarefa'
   *       500:
   *         description: Erro interno
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Erro'
   */
  router.post('/', (req: Request, res: Response) => tarefaControlador.criarTarefa(req, res));

  /**
   * @swagger
   * /api/tarefas:
   *   get:
   *     tags: [Tarefas]
   *     summary: Listar todas as tarefas
   *     responses:
   *       200:
   *         description: Lista de tarefas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Tarefa'
   *       500:
   *         description: Erro interno
   */
  router.get('/', (req: Request, res: Response) => tarefaControlador.listarTarefas(req, res));

  /**
   * @swagger
   * /api/tarefas/{id}:
   *   get:
   *     tags: [Tarefas]
   *     summary: Buscar uma tarefa pelo ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Tarefa encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Tarefa'
   *       404:
   *         description: Tarefa não encontrada
   *       500:
   *         description: Erro interno
   */
  router.get('/:id', (req: Request, res: Response) => tarefaControlador.buscarTarefa(req, res));

  /**
   * @swagger
   * /api/tarefas/{id}:
   *   put:
   *     tags: [Tarefas]
   *     summary: Atualizar tarefa existente
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AtualizarTarefaInput'
   *     responses:
   *       200:
   *         description: Tarefa atualizada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Tarefa'
   *       404:
   *         description: Tarefa não encontrada
   *       500:
   *         description: Erro interno
   */
  router.put('/:id', (req: Request, res: Response) => tarefaControlador.atualizarTarefa(req, res));

  /**
   * @swagger
   * /api/tarefas/{id}:
   *   delete:
   *     tags: [Tarefas]
   *     summary: Excluir tarefa
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Removida sem conteúdo
   *       404:
   *         description: Tarefa não encontrada
   *       500:
   *         description: Erro interno
   */
  router.delete('/:id', (req: Request, res: Response) => tarefaControlador.excluirTarefa(req, res));

  return router;
}
