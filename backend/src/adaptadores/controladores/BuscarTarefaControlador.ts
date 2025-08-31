import { Request, Response } from 'express';
import { BuscarTarefaService } from '../../aplicacao/servicos/BuscarTarefaService';

export class BuscarTarefaControlador {
  constructor(private service: BuscarTarefaService) {}

  async handle(req: Request, res: Response) {
    try {
      const tarefa = await this.service.execute(Number(req.params.id));
      return res.json(tarefa);
    } catch (e: any) {
      return res.status(e?.status || 500).json({ mensagem: e?.message || 'Erro interno' });
    }
  }
}