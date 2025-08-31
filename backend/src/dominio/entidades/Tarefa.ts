export type TarefaId = number;
export type StatusTarefa = 'pendente' | 'em_andamento' | 'concluida';
export type PrioridadeTarefa = 'baixa' | 'media' | 'alta';

export interface TarefaProps {
  id?: TarefaId;
  titulo: string;
  descricao?: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
  dataVencimento?: Date;
}

export class Tarefa {
  private props: TarefaProps;

  constructor(props: TarefaProps) {
    this.props = {
      ...props,
      status: props.status || 'pendente',
      prioridade: props.prioridade || 'media',
      dataCriacao: props.dataCriacao || new Date(),
      dataAtualizacao: props.dataAtualizacao || new Date()
    };
  }

  get id(): TarefaId | undefined {
    return this.props.id;
  }

  get titulo(): string {
    return this.props.titulo;
  }

  get descricao(): string | undefined {
    return this.props.descricao;
  }

  get status(): StatusTarefa {
    return this.props.status;
  }

  get prioridade(): PrioridadeTarefa {
    return this.props.prioridade;
  }

  get dataCriacao(): Date {
    return this.props.dataCriacao as Date;
  }

  get dataAtualizacao(): Date {
    return this.props.dataAtualizacao as Date;
  }

  get dataVencimento(): Date | undefined {
    return this.props.dataVencimento;
  }

  set titulo(titulo: string) {
    this.props.titulo = titulo;
    this.props.dataAtualizacao = new Date();
  }

  set descricao(descricao: string | undefined) {
    this.props.descricao = descricao;
    this.props.dataAtualizacao = new Date();
  }

  set status(status: StatusTarefa) {
    this.props.status = status;
    this.props.dataAtualizacao = new Date();
  }

  set prioridade(prioridade: PrioridadeTarefa) {
    this.props.prioridade = prioridade;
    this.props.dataAtualizacao = new Date();
  }

  set dataVencimento(data: Date | undefined) {
    this.props.dataVencimento = data;
    this.props.dataAtualizacao = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      descricao: this.descricao,
      status: this.status,
      prioridade: this.prioridade,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao,
      dataVencimento: this.dataVencimento
    };
  }
}
