import { Connection } from 'mysql2/promise';
import { Tarefa, TarefaId } from '../../dominio/entidades/Tarefa';
import { ITarefaRepositorio } from '../../dominio/portas/ITarefaRepositorio';

export class MySQLTarefaRepositorio implements ITarefaRepositorio {
  constructor(private connection: Connection) {}

  async criar(tarefa: Tarefa): Promise<Tarefa> {
    const query = `
      INSERT INTO tarefas (titulo, descricao, status, prioridade, data_vencimento, data_criacao, data_atualizacao)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await this.connection.execute(query, [
      tarefa.titulo,
      tarefa.descricao || null,
      tarefa.status,
      tarefa.prioridade,
      tarefa.dataVencimento ? tarefa.dataVencimento : null,
      tarefa.dataCriacao,
      tarefa.dataAtualizacao
    ]);

    const id = (result as any).insertId;
    
    const novaTarefa = new Tarefa({
      id,
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      status: tarefa.status,
      prioridade: tarefa.prioridade,
      dataVencimento: tarefa.dataVencimento,
      dataCriacao: tarefa.dataCriacao,
      dataAtualizacao: tarefa.dataAtualizacao
    });

    return novaTarefa;
  }

  async buscarTodos(): Promise<Tarefa[]> {
    const [rows] = await this.connection.execute('SELECT * FROM tarefas ORDER BY data_criacao DESC');
    
    return (rows as any[]).map(row => new Tarefa({
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      status: row.status,
      prioridade: row.prioridade,
      dataVencimento: row.data_vencimento ? new Date(row.data_vencimento) : undefined,
      dataCriacao: new Date(row.data_criacao),
      dataAtualizacao: new Date(row.data_atualizacao)
    }));
  }

  async buscarPorId(id: TarefaId): Promise<Tarefa | null> {
    const [rows] = await this.connection.execute('SELECT * FROM tarefas WHERE id = ?', [id]);
    const tarefas = rows as any[];
    
    if (tarefas.length === 0) {
      return null;
    }

    const row = tarefas[0];
    
    return new Tarefa({
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      status: row.status,
      prioridade: row.prioridade,
      dataVencimento: row.data_vencimento ? new Date(row.data_vencimento) : undefined,
      dataCriacao: new Date(row.data_criacao),
      dataAtualizacao: new Date(row.data_atualizacao)
    });
  }

  async atualizar(tarefa: Tarefa): Promise<Tarefa> {
    const query = `
      UPDATE tarefas 
      SET titulo = ?, descricao = ?, status = ?, prioridade = ?, 
          data_vencimento = ?, data_atualizacao = ?
      WHERE id = ?
    `;

    await this.connection.execute(query, [
      tarefa.titulo,
      tarefa.descricao || null,
      tarefa.status,
      tarefa.prioridade,
      tarefa.dataVencimento ? tarefa.dataVencimento : null,
      tarefa.dataAtualizacao,
      tarefa.id
    ]);

    return tarefa;
  }

  async excluir(id: TarefaId): Promise<void> {
    await this.connection.execute('DELETE FROM tarefas WHERE id = ?', [id]);
  }
}
