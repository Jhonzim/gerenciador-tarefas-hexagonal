import { PrioridadeTarefa } from "../../dominio/valores/PrioridadeTarefa";
import { StatusTarefa } from "../../dominio/valores/StatusTarefa";

export interface CriarTarefaDTO {
  titulo: string;
  descricao?: string;
  status?: StatusTarefa;
  prioridade?: PrioridadeTarefa;
  dataVencimento?: string; 
}