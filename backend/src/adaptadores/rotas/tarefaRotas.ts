import { Router, Request, Response } from 'express';
import { TarefaControlador } from '../controladores/TarefaControlador';

export function criarTarefaRotas(tarefaControlador: TarefaControlador): Router {
  const router = Router();

  router.post('/', (req: Request, res: Response) => tarefaControlador.criarTarefa(req, res));
  router.get('/', (req: Request, res: Response) => tarefaControlador.listarTarefas(req, res));
  router.get('/:id', (req: Request, res: Response) => tarefaControlador.buscarTarefa(req, res));
  router.put('/:id', (req: Request, res: Response) => tarefaControlador.atualizarTarefa(req, res));
  router.delete('/:id', (req: Request, res: Response) => tarefaControlador.excluirTarefa(req, res));

  return router;
}
