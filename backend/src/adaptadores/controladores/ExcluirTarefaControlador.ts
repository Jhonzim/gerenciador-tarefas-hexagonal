import { ExcluirTarefaService } from '../../aplicacao/servicos/ExcluirTarefaService';

export class ExcluirTarefaControlador {
  constructor(private service: ExcluirTarefaService) {}

  async handle(req: import('express').Request, res: import('express').Response) {
    try {
      await this.service.execute(Number(req.params.id));
      return res.status(204).end();
    } catch (e: any) {
      return res.status(e?.status || 500).json({ mensagem: e?.message || 'Erro interno' });
    }
  }
}