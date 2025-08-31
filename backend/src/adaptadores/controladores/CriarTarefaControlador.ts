import { CriarTarefaService } from '../../aplicacao/servicos/CriarTarefaService';

export class CriarTarefaControlador {
  constructor(private service: CriarTarefaService) {}

  async handle(req: import('express').Request, res: import('express').Response) {
    // Validação assumida existente
    try {
      const tarefa = await this.service.execute({
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        status: req.body.status || 'pendente',
        prioridade: req.body.prioridade || 'media',
        dataVencimento: req.body.dataVencimento ? req.body.dataVencimento : undefined
      });
      return res.status(201).json(tarefa);
    } catch (e: any) {
      return res.status(e?.status || 500).json({ mensagem: e?.message || 'Erro interno' });
    }
  }
}