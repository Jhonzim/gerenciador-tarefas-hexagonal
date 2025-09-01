import { ITarefaRepositorio } from '../../dominio/portas/ITarefaRepositorio';
import { ErroAplicacao } from '../../dominio/erros/ErroAplicacao';
import { IAcaoTarefa } from './IAcaoTarefa';
import { TarefaDTO } from '../dtos/TarefaDTO';
import { TarefaMapper } from '../mapeadores/TarefaMapper';
import { TarefaFabrica } from '../../dominio/fabricas/TarefaFabrica';
import { AtualizarTarefaDTO } from '../dtos/AtualizarTarefaDTO';

export class AtualizarTarefaService implements IAcaoTarefa<AtualizarTarefaDTO, TarefaDTO> {
  constructor(private repo: ITarefaRepositorio) {}

  async execute(dados: AtualizarTarefaDTO): Promise<TarefaDTO> {
    TarefaFabrica.validarAtualizacao(dados);

    const existente = await this.repo.buscarPorId(dados.id);
    if (!existente) throw new ErroAplicacao('Tarefa não encontrada', 404);

    if (dados.titulo !== undefined) existente.titulo = dados.titulo;
    if (dados.descricao !== undefined) existente.descricao = dados.descricao;
    if (dados.status !== undefined) existente.status = dados.status;
    if (dados.prioridade !== undefined) existente.prioridade = dados.prioridade;
    if (dados.dataVencimento !== undefined) {
      existente.dataVencimento = dados.dataVencimento ? new Date(dados.dataVencimento) : undefined;
    }

    const atualizado = await this.repo.atualizar(existente);
    return TarefaMapper.toDTO(atualizado);
  }
}
