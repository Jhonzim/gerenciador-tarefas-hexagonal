import { Request, Response } from 'express';
import { TarefaServico } from '../../aplicacao/TarefaServico';

export class TarefaControlador {
  constructor(private tarefaServico: TarefaServico) {}

  async  criarTarefa(req: Request, res: Response): Promise<void> {
    try {
      const { titulo, descricao, status, prioridade, dataVencimento } = req.body;
      
      const tarefa = await this.tarefaServico.criarTarefa({
        titulo,
        descricao,
        status,
        prioridade,
        dataVencimento: dataVencimento ? new Date(dataVencimento) : undefined
      });
      
      res.status(201).json(tarefa);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ mensagem: 'Erro ao criar tarefa' });
    }
  }

  async listarTarefas(req: Request, res: Response): Promise<void> {
    try {
      const tarefas = await this.tarefaServico.listarTarefas();
      res.status(200).json(tarefas);
    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
      res.status(500).json({ mensagem: 'Erro ao listar tarefas' });
    }
  }

  async buscarTarefa(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const tarefa = await this.tarefaServico.buscarTarefa(id);
      
      if (!tarefa) {
        res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        return;
      }
      
      res.status(200).json(tarefa);
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      res.status(500).json({ mensagem: 'Erro ao buscar tarefa' });
    }
  }

  async atualizarTarefa(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const { titulo, descricao, status, prioridade, dataVencimento } = req.body;
      
      const tarefa = await this.tarefaServico.atualizarTarefa(id, {
        titulo,
        descricao,
        status,
        prioridade,
        dataVencimento: dataVencimento ? new Date(dataVencimento) : undefined
      });
      
      if (!tarefa) {
        res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        return;
      }
      
      res.status(200).json(tarefa);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).json({ mensagem: 'Erro ao atualizar tarefa' });
    }
  }

  async excluirTarefa(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const sucesso = await this.tarefaServico.excluirTarefa(id);
      
      if (!sucesso) {
        res.status(404).json({ mensagem: 'Tarefa não encontrada' });
        return;
      }
      
      res.status(204).end();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      res.status(500).json({ mensagem: 'Erro ao excluir tarefa' });
    }
  }
}
