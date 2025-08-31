import { ITarefaRepositorio } from '../../dominio/portas/ITarefaRepositorio';
import { TarefaId } from '../../dominio/entidades/Tarefa';
import { ErroAplicacao } from '../../dominio/erros/ErroAplicacao';
import { IAcaoTarefa } from './IAcaoTarefa';

export class ExcluirTarefaService implements IAcaoTarefa<TarefaId, void> {
  constructor(private repo: ITarefaRepositorio) {}
  async execute(id: TarefaId): Promise<void> {
    const existente = await this.repo.buscarPorId(id);
    if (!existente) throw new ErroAplicacao('Tarefa não encontrada', 404);
    await this.repo.excluir(id);
  }
}
