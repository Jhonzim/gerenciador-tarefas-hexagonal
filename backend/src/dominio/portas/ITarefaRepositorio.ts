import { Tarefa, TarefaId } from '../entidades/Tarefa';

export interface ITarefaRepositorio {
  criar(tarefa: Tarefa): Promise<Tarefa>;
  buscarTodos(): Promise<Tarefa[]>;
  buscarPorId(id: TarefaId): Promise<Tarefa | null>;
  atualizar(tarefa: Tarefa): Promise<Tarefa>;
  excluir(id: TarefaId): Promise<void>;
}
