import { Tarefa, TarefaProps, StatusTarefa, PrioridadeTarefa } from '../entidades/Tarefa';
import { CriarTarefaDTO } from '../../aplicacao/dtos/TarefaDTO';

export class TarefaFabrica {
  static criar(dados: CriarTarefaDTO): Tarefa {
    const status: StatusTarefa = dados.status || 'pendente';
    const prioridade: PrioridadeTarefa = dados.prioridade || 'media';
    const dataVencimento = dados.dataVencimento ? new Date(dados.dataVencimento) : undefined;

    const props: TarefaProps = {
      titulo: dados.titulo,
      descricao: dados.descricao,
      status,
      prioridade,
      dataVencimento
    };
    return new Tarefa(props);
  }
}
