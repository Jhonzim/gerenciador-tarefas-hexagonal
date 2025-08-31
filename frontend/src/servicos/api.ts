import axios from 'axios';
import { Tarefa } from '../tipos/Tarefa';


const api = axios.create({
  baseURL: `http://localhost:3000/api`
});

console.log('API baseURL:', api.defaults.baseURL);

export const TarefaAPI = {
  listar: async (): Promise<Tarefa[]> => {
    const response = await api.get('/tarefas');
    return response.data;
  },
  
  buscarPorId: async (id: number): Promise<Tarefa> => {
    const response = await api.get(`/tarefas/${id}`);
    return response.data;
  },
  
  criar: async (tarefa: Omit<Tarefa, 'id' | 'dataCriacao' | 'dataAtualizacao'>): Promise<Tarefa> => {
    const response = await api.post('/tarefas', tarefa);
    return response.data;
  },
  
  atualizar: async (id: number, tarefa: Partial<Omit<Tarefa, 'id' | 'dataCriacao' | 'dataAtualizacao'>>): Promise<Tarefa> => {
    const response = await api.put(`/tarefas/${id}`, tarefa);
    return response.data;
  },
  
  excluir: async (id: number): Promise<void> => {
    await api.delete(`/tarefas/${id}`);
  }
};
