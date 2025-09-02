import { Tarefa, TarefaProps } from '../entidades/Tarefa';
import { ErroAplicacao } from '../erros/ErroAplicacao';
import { STATUS_TAREFA_VALORES, StatusTarefa } from '../valores/StatusTarefa';
import { PRIORIDADE_TAREFA_VALORES, PrioridadeTarefa } from '../valores/PrioridadeTarefa';
import { CriarTarefaDTO } from '../../aplicacao/dtos/CriarTarefaDTO';
import { AtualizarTarefaDTO } from '../../aplicacao/dtos/AtualizarTarefaDTO';

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
    const status = dados.status as StatusTarefa;
    if (status && !STATUS_TAREFA_VALORES.includes(status)) {
      throw new ErroAplicacao('Status inválido', 400);
    }
    const prioridade = dados.prioridade as PrioridadeTarefa;
    if (prioridade && !PRIORIDADE_TAREFA_VALORES.includes(prioridade)) {
      throw new ErroAplicacao('Prioridade inválida', 400);
    }
    if (dados.dataVencimento) {
      const d = new Date(dados.dataVencimento);
      if (isNaN(d.getTime())) {
        throw new ErroAplicacao('Data de vencimento inválida (usar ISO 8601)', 400);
      }
    }
  }

  public static validarAtualizacao(dados: AtualizarTarefaDTO) {
    if (!dados || typeof dados !== 'object') {
      throw new ErroAplicacao('Payload inválido', 400);
    }

    const { titulo, descricao, status, prioridade, dataVencimento } = dados;

    if (
      titulo === undefined &&
      descricao === undefined &&
      status === undefined &&
      prioridade === undefined &&
      dataVencimento === undefined
    ) {
      throw new ErroAplicacao('Nenhum campo para atualizar', 400);
    }

    if (titulo !== undefined) {
      if (!titulo.trim()) throw new ErroAplicacao('Título não pode ser vazio', 400);
      if (titulo.length > 120) throw new ErroAplicacao('Título excede 120 caracteres', 400);
    }

    if (descricao !== undefined && descricao.length > 1000) {
      throw new ErroAplicacao('Descrição excede 1000 caracteres', 400);
    }

    if (status !== undefined && !STATUS_TAREFA_VALORES.includes(status)) {
      throw new ErroAplicacao('Status inválido', 400);
    }

    if (prioridade !== undefined && !PRIORIDADE_TAREFA_VALORES.includes(prioridade)) {
      throw new ErroAplicacao('Prioridade inválida', 400);
    }

    if (dataVencimento !== undefined) {
      if (dataVencimento === null) return;
      const d = new Date(dataVencimento);
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