export type StatusTarefa = 'pendente' | 'em_andamento' | 'concluida';
export type PrioridadeTarefa = 'baixa' | 'media' | 'alta';

export interface Tarefa {
  id?: number;
  titulo: string;
  descricao?: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  dataCriacao?: string;
  dataAtualizacao?: string;
  dataVencimento?: string;
}
