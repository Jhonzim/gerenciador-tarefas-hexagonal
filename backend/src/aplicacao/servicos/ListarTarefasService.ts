import { ITarefaRepositorio } from '../../dominio/portas/ITarefaRepositorio';
import { IAcaoTarefa } from './IAcaoTarefa';
import { TarefaDTO } from '../dtos/TarefaDTO';
import { TarefaMapper } from '../mapeadores/TarefaMapper';

export class ListarTarefasService implements IAcaoTarefa<void, TarefaDTO[]> {
  constructor(private repo: ITarefaRepositorio) {}

  async execute(): Promise<TarefaDTO[]> {
    const entidades = await this.repo.buscarTodos();
    return entidades.map(TarefaMapper.toDTO);
  }
}
