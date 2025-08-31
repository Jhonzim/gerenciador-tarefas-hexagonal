import { ListarTarefasService } from '../../aplicacao/servicos/ListarTarefasService';

export class ListarTarefasControlador {
  constructor(private service: ListarTarefasService) {}

  async handle(_req: import('express').Request, res: import('express').Response) {
    try {
      const tarefas = await this.service.execute();
      return res.json(tarefas);
    } catch {
      return res.status(500).json({ mensagem: 'Erro interno' });
    }
  }
}