import { StatusTarefa } from '../../dominio/valores/StatusTarefa';
import { PrioridadeTarefa } from '../../dominio/valores/PrioridadeTarefa';

export interface TarefaDTO {
  id: number;
  titulo: string;
  descricao?: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  dataCriacao: string;
  dataAtualizacao: string;
  dataVencimento?: string | null;
}




