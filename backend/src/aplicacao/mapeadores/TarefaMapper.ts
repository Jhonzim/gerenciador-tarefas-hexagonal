import { Tarefa } from '../../dominio/entidades/Tarefa';
import { TarefaDTO } from '../dtos/TarefaDTO';

export class TarefaMapper {
  static toDTO(entidade: Tarefa): TarefaDTO {
    return {
      id: entidade.id as number,
      titulo: entidade.titulo,
      descricao: entidade.descricao,
      status: entidade.status,
      prioridade: entidade.prioridade,
      dataCriacao: entidade.dataCriacao.toISOString(),
      dataAtualizacao: entidade.dataAtualizacao.toISOString(),
      dataVencimento: entidade.dataVencimento ? entidade.dataVencimento.toISOString() : null
    };
  }
}
