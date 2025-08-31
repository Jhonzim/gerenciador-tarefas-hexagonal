import { Tarefa, TarefaProps } from '../../dominio/entidades/Tarefa';
import { CriarTarefaDTO } from '../../aplicacao/dtos/TarefaDTO';
import { STATUS_TAREFA_VALORES, StatusTarefa } from '../../dominio/valores/StatusTarefa';
import { PRIORIDADE_TAREFA_VALORES, PrioridadeTarefa } from '../../dominio/valores/PrioridadeTarefa';
import { ErroAplicacao } from '../../dominio/erros/ErroAplicacao';

export class TarefaFabrica {
  private static validar(dados: CriarTarefaDTO) {
    if (!dados.titulo || !dados.titulo.trim()) {
      throw new ErroAplicacao('Título obrigatório', 400);
    }
    if (dados.titulo.length > 120) {
      throw new ErroAplicacao('Título excede 120 caracteres', 400);
    }
    if (dados.descricao && dados.descricao.length > 1000) {
      throw new ErroAplicacao('Descrição excede 1000 caracteres', 400);
    }
    if (dados.status && !STATUS_TAREFA_VALORES.includes(dados.status)) {
      throw new ErroAplicacao('Status inválido', 400);
    }
    if (dados.prioridade && !PRIORIDADE_TAREFA_VALORES.includes(dados.prioridade)) {
      throw new ErroAplicacao('Prioridade inválida', 400);
    }
    if (dados.dataVencimento) {
      const d = new Date(dados.dataVencimento);
      if (isNaN(d.getTime())) {
        throw new ErroAplicacao('Data de vencimento inválida (usar ISO 8601)', 400);
      }
    }
  }

  static criar(dados: CriarTarefaDTO): Tarefa {
    this.validar(dados);

    const status: StatusTarefa = (dados.status as StatusTarefa) || 'pendente';
    const prioridade: PrioridadeTarefa = (dados.prioridade as PrioridadeTarefa) || 'media';
    const dataVencimento = dados.dataVencimento ? new Date(dados.dataVencimento) : undefined;

    const props: TarefaProps = {
      titulo: dados.titulo.trim(),
      descricao: dados.descricao?.trim(),
      status,
      prioridade,
      dataVencimento
    };
    return new Tarefa(props);
  }
}