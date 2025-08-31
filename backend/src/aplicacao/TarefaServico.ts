import { Tarefa, TarefaId, TarefaProps } from '../dominio/entidades/Tarefa';
import { ITarefaRepositorio } from '../dominio/portas/ITarefaRepositorio';

export class TarefaServico {
  constructor(private tarefaRepositorio: ITarefaRepositorio) {}

  async criarTarefa(tarefaData: Omit<TarefaProps, 'id' | 'dataCriacao' | 'dataAtualizacao'>): Promise<Tarefa> {
    const tarefa = new Tarefa(tarefaData);
    return this.tarefaRepositorio.criar(tarefa);
  }

  async listarTarefas(): Promise<Tarefa[]> {
    return this.tarefaRepositorio.buscarTodos();
  }

  async buscarTarefa(id: TarefaId): Promise<Tarefa | null> {
    return this.tarefaRepositorio.buscarPorId(id);
  }

  async atualizarTarefa(id: TarefaId, tarefaData: Partial<Omit<TarefaProps, 'id' | 'dataCriacao' | 'dataAtualizacao'>>): Promise<Tarefa | null> {
    const tarefaExistente = await this.tarefaRepositorio.buscarPorId(id);
    
    if (!tarefaExistente) {
      return null;
    }

    if (tarefaData.titulo !== undefined) {
      tarefaExistente.titulo = tarefaData.titulo;
    }
    
    if (tarefaData.descricao !== undefined) {
      tarefaExistente.descricao = tarefaData.descricao;
    }
    
    if (tarefaData.status !== undefined) {
      tarefaExistente.status = tarefaData.status;
    }
    
    if (tarefaData.prioridade !== undefined) {
      tarefaExistente.prioridade = tarefaData.prioridade;
    }
    
    if (tarefaData.dataVencimento !== undefined) {
      tarefaExistente.dataVencimento = tarefaData.dataVencimento;
    }

    return this.tarefaRepositorio.atualizar(tarefaExistente);
  }

  async excluirTarefa(id: TarefaId): Promise<boolean> {
    const tarefaExistente = await this.tarefaRepositorio.buscarPorId(id);
    
    if (!tarefaExistente) {
      return false;
    }

    await this.tarefaRepositorio.excluir(id);
    return true;
  }
}
