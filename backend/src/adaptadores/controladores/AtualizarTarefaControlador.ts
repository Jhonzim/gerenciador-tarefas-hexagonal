import { AtualizarTarefaService } from '../../aplicacao/servicos/AtualizarTarefaService';

export class AtualizarTarefaControlador {
  constructor(private service: AtualizarTarefaService) {}

  async handle(req: import('express').Request, res: import('express').Response) {
    try {
      const tarefa = await this.service.execute({
        id: Number(req.params.id),
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        status: req.body.status,
        prioridade: req.body.prioridade,
        dataVencimento: req.body.dataVencimento ? req.body.dataVencimento : undefined
      });

      return res.json(tarefa);
    } catch (e: any) {
      return res.status(e?.status || 500).json({ mensagem: e?.message || 'Erro interno' });
    }
  }
}