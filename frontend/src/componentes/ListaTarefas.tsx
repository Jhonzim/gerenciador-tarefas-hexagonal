import React, { useState, useEffect } from 'react';
import { Tarefa } from '../tipos/Tarefa';
import { TarefaAPI } from '../servicos/api';
import FormularioTarefa from './FormularioTarefa';

const ListaTarefas: React.FC = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [tarefaParaEditar, setTarefaParaEditar] = useState<Tarefa | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarTarefas = async () => {
    try {
      setCarregando(true);
      const tarefasCarregadas = await TarefaAPI.listar();
      setTarefas(tarefasCarregadas);
      setErro('');
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      setErro('Falha ao carregar as tarefas. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  const handleSalvarTarefa = async (tarefa: Omit<Tarefa, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => {
    try {
      if (tarefaParaEditar && tarefaParaEditar.id) {
        await TarefaAPI.atualizar(tarefaParaEditar.id, tarefa);
      } else {
        await TarefaAPI.criar(tarefa);
      }
      
      setTarefaParaEditar(null);
      await carregarTarefas();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      setErro('Falha ao salvar a tarefa. Tente novamente mais tarde.');
    }
  };

  const handleEditarTarefa = (tarefa: Tarefa) => {
    setTarefaParaEditar(tarefa);
  };

  const handleExcluirTarefa = async (id?: number) => {
    if (!id) return;
    
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await TarefaAPI.excluir(id);
        await carregarTarefas();
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        setErro('Falha ao excluir a tarefa. Tente novamente mais tarde.');
      }
    }
  };

  const formatarData = (dataString?: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const getCorPrioridade = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return '#f44336';
      case 'media':
        return '#ff9800';
      case 'baixa':
        return '#4caf50';
      default:
        return '#000000';
    }
  };

  const getCorStatus = (status: string) => {
    switch (status) {
      case 'pendente':
        return '#f44336';
      case 'em_andamento':
        return '#2196f3';
      case 'concluida':
        return '#4caf50';
      default:
        return '#000000';
    }
  };

  return (
    <div className="lista-tarefas">
      <h2>Gerenciador de Tarefas</h2>
      
      {erro && <div className="erro">{erro}</div>}
      
      <FormularioTarefa 
        tarefa={tarefaParaEditar} 
        onSalvar={handleSalvarTarefa} 
        onCancelar={() => setTarefaParaEditar(null)} 
      />
      
      {carregando ? (
        <p>Carregando tarefas...</p>
      ) : (
        <div className="tabela-container">
          {tarefas.length === 0 ? (
            <p>Nenhuma tarefa encontrada. Crie uma nova tarefa acima.</p>
          ) : (
            <table className="tabela-tarefas">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th>Prioridade</th>
                  <th>Data de Vencimento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tarefas.map(tarefa => (
                  <tr key={tarefa.id}>
                    <td>{tarefa.titulo}</td>
                    <td>{tarefa.descricao || '-'}</td>
                    <td>
                      <span style={{ color: getCorStatus(tarefa.status) }}>
                        {tarefa.status === 'em_andamento' ? 'Em Andamento' : 
                          tarefa.status === 'pendente' ? 'Pendente' : 'Concluída'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: getCorPrioridade(tarefa.prioridade) }}>
                        {tarefa.prioridade === 'alta' ? 'Alta' : 
                          tarefa.prioridade === 'media' ? 'Média' : 'Baixa'}
                      </span>
                    </td>
                    <td>{tarefa.dataVencimento ? formatarData(tarefa.dataVencimento) : '-'}</td>
                    <td>
                      <button 
                        className="botao-editar" 
                        onClick={() => handleEditarTarefa(tarefa)}
                      >
                        Editar
                      </button>
                      <button 
                        className="botao-excluir" 
                        onClick={() => handleExcluirTarefa(tarefa.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ListaTarefas;
