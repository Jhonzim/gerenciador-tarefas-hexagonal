import { ITarefaRepositorio } from '../../dominio/portas/ITarefaRepositorio';
import { IAcaoTarefa } from './IAcaoTarefa';
import { TarefaDTO } from '../dtos/TarefaDTO';
import { TarefaFabrica } from '../../dominio/fabricas/TarefaFabrica';
import { TarefaMapper } from '../mapeadores/TarefaMapper';
import { CriarTarefaDTO } from '../dtos/CriarTarefaDTO';

export class CriarTarefaService implements IAcaoTarefa<CriarTarefaDTO, TarefaDTO> {
  constructor(private repo: ITarefaRepositorio) {}

  async execute(dados: CriarTarefaDTO): Promise<TarefaDTO> {
    const entidade = TarefaFabrica.criar(dados);
    const criada = await this.repo.criar(entidade);
    return TarefaMapper.toDTO(criada);
  }
}
