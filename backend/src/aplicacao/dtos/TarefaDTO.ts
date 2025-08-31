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

// Entrada para criação (campos opcionais com defaults aplicados na fábrica)
export interface CriarTarefaDTO {
  titulo: string;
  descricao?: string;
  status?: StatusTarefa;
  prioridade?: PrioridadeTarefa;
  dataVencimento?: string; // ISO (yyyy-mm-dd ou completo)
}

// Entrada para atualização
export interface AtualizarTarefaDTO {
  id: number;
  titulo?: string;
  descricao?: string;
  status?: StatusTarefa;
  prioridade?: PrioridadeTarefa;
  dataVencimento?: string | null;
}

