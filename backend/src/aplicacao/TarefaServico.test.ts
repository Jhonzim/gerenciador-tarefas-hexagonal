import { TarefaServico } from './TarefaServico';
import { Tarefa, TarefaId } from '../dominio/entidades/Tarefa';
import { ITarefaRepositorio } from '../dominio/portas/ITarefaRepositorio';

// Adicionar referência explícita ao Jest
// @ts-ignore
import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock do repositório
class MockTarefaRepositorio implements ITarefaRepositorio {
  private tarefas: Tarefa[] = [];
  private nextId: TarefaId = 1;

  async criar(tarefa: Tarefa): Promise<Tarefa> {
    const novaTarefa = new Tarefa({
      ...tarefa.toJSON(),
      id: this.nextId++
    });
    this.tarefas.push(novaTarefa);
    return novaTarefa;
  }

  async buscarTodos(): Promise<Tarefa[]> {
    return [...this.tarefas];
  }

  async buscarPorId(id: TarefaId): Promise<Tarefa | null> {
    const tarefa = this.tarefas.find(t => t.id === id);
    return tarefa || null;
  }

  async atualizar(tarefa: Tarefa): Promise<Tarefa> {
    const index = this.tarefas.findIndex(t => t.id === tarefa.id);
    if (index !== -1) {
      this.tarefas[index] = tarefa;
    }
    return tarefa;
  }

  async excluir(id: TarefaId): Promise<void> {
    const index = this.tarefas.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tarefas.splice(index, 1);
    }
  }
}

describe('TarefaServico', () => {
  let tarefaServico: TarefaServico;
  let mockRepositorio: ITarefaRepositorio;

  beforeEach(() => {
    mockRepositorio = new MockTarefaRepositorio();
    tarefaServico = new TarefaServico(mockRepositorio);
  });

  it('deve criar uma nova tarefa', async () => {
    const dadosTarefa = {
      titulo: 'Teste',
      descricao: 'Descrição teste',
      status: 'pendente' as const,
      prioridade: 'media' as const
    };

    const tarefa = await tarefaServico.criarTarefa(dadosTarefa);

    expect(tarefa.id).toBe(1);
    expect(tarefa.titulo).toBe(dadosTarefa.titulo);
    expect(tarefa.descricao).toBe(dadosTarefa.descricao);
    expect(tarefa.status).toBe(dadosTarefa.status);
    expect(tarefa.prioridade).toBe(dadosTarefa.prioridade);
  });

  it('deve listar todas as tarefas', async () => {
    await tarefaServico.criarTarefa({
      titulo: 'Tarefa 1',
      status: 'pendente' as const,
      prioridade: 'baixa' as const
    });

    await tarefaServico.criarTarefa({
      titulo: 'Tarefa 2',
      status: 'em_andamento' as const,
      prioridade: 'alta' as const
    });

    const tarefas = await tarefaServico.listarTarefas();
    
    expect(tarefas.length).toBe(2);
    expect(tarefas[0].titulo).toBe('Tarefa 1');
    expect(tarefas[1].titulo).toBe('Tarefa 2');
  });

  it('deve buscar tarefa por ID', async () => {
    const tarefa = await tarefaServico.criarTarefa({
      titulo: 'Tarefa Teste',
      status: 'pendente' as const,
      prioridade: 'media' as const
    });

    const tarefaEncontrada = await tarefaServico.buscarTarefa(tarefa.id as TarefaId);
    
    expect(tarefaEncontrada).not.toBeNull();
    expect(tarefaEncontrada?.titulo).toBe('Tarefa Teste');
  });

  it('deve atualizar uma tarefa existente', async () => {
    const tarefa = await tarefaServico.criarTarefa({
      titulo: 'Tarefa Antiga',
      status: 'pendente' as const,
      prioridade: 'media' as const
    });

    const tarefaAtualizada = await tarefaServico.atualizarTarefa(
      tarefa.id as TarefaId,
      {
        titulo: 'Tarefa Nova',
        status: 'em_andamento' as const
      }
    );
    
    expect(tarefaAtualizada).not.toBeNull();
    expect(tarefaAtualizada?.titulo).toBe('Tarefa Nova');
    expect(tarefaAtualizada?.status).toBe('em_andamento');
    expect(tarefaAtualizada?.prioridade).toBe('media'); // Não mudou
  });

  it('deve excluir uma tarefa existente', async () => {
    const tarefa = await tarefaServico.criarTarefa({
      titulo: 'Tarefa para Excluir',
      status: 'pendente' as const,
      prioridade: 'media' as const
    });

    const sucesso = await tarefaServico.excluirTarefa(tarefa.id as TarefaId);
    expect(sucesso).toBe(true);

    const tarefas = await tarefaServico.listarTarefas();
    expect(tarefas.length).toBe(0);
  });
});
