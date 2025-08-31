import { ITarefaRepositorio } from '../../dominio/portas/ITarefaRepositorio';
import { TarefaId } from '../../dominio/entidades/Tarefa';
import { ErroAplicacao } from '../../dominio/erros/ErroAplicacao';
import { IAcaoTarefa } from './IAcaoTarefa';
import { TarefaDTO } from '../dtos/TarefaDTO';
import { TarefaMapper } from '../mapeadores/TarefaMapper';

export class BuscarTarefaService implements IAcaoTarefa<TarefaId, TarefaDTO> {
  constructor(private repo: ITarefaRepositorio) {}

  async execute(id: TarefaId): Promise<TarefaDTO> {
    const tarefa = await this.repo.buscarPorId(id);
    if (!tarefa) throw new ErroAplicacao('Tarefa não encontrada', 404);
    return TarefaMapper.toDTO(tarefa);
  }
}
