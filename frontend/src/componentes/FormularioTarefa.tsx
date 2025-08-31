import * as React from 'react';
import { useState, useEffect } from 'react';
import { Tarefa, StatusTarefa, PrioridadeTarefa } from '../tipos/Tarefa';

interface FormularioTarefaProps {
  tarefa: Tarefa | null;
  onSalvar: (tarefa: Omit<Tarefa, 'id' | 'dataCriacao' | 'dataAtualizacao'>) => void;
  onCancelar: () => void;
}

const FormularioTarefa: React.FC<FormularioTarefaProps> = ({ tarefa, onSalvar, onCancelar }): React.ReactElement => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState<StatusTarefa>('pendente');
  const [prioridade, setPrioridade] = useState<PrioridadeTarefa>('media');
  const [dataVencimento, setDataVencimento] = useState('');
  
  useEffect(() => {
    if (tarefa) {
      setTitulo(tarefa.titulo);
      setDescricao(tarefa.descricao || '');
      setStatus(tarefa.status);
      setPrioridade(tarefa.prioridade);
      
      if (tarefa.dataVencimento) {
        const data = new Date(tarefa.dataVencimento);
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        setDataVencimento(`${ano}-${mes}-${dia}`);
      } else {
        setDataVencimento('');
      }
    } else {
      limparFormulario();
    }
  }, [tarefa]);

  const limparFormulario = () => {
    setTitulo('');
    setDescricao('');
    setStatus('pendente');
    setPrioridade('media');
    setDataVencimento('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo.trim()) {
      alert('O título é obrigatório');
      return;
    }
    
    onSalvar({
      titulo,
      descricao: descricao || undefined,
      status,
      prioridade,
      dataVencimento: dataVencimento ? dataVencimento : undefined
    });
    
    if (!tarefa) {
      limparFormulario();
    }
  };

  return (
    <div className="formulario-tarefa">
      <h3>{tarefa ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grupo">
          <label htmlFor="titulo">Título *</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-grupo">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusTarefa)}
          >
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluida">Concluída</option>
          </select>
        </div>

        <div className="form-grupo">
          <label htmlFor="prioridade">Prioridade</label>
          <select
            id="prioridade"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value as PrioridadeTarefa)}
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div className="form-grupo">
          <label htmlFor="dataVencimento">Data de Vencimento</label>
          <input
            type="date"
            id="dataVencimento"
            value={dataVencimento}
            onChange={(e) => setDataVencimento(e.target.value)}
          />
        </div>

        <div className="botoes-acao">
          <button type="submit" className="botao-salvar">
            {tarefa ? 'Atualizar' : 'Criar'}
          </button>
          {tarefa && (
            <button type="button" className="botao-cancelar" onClick={onCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormularioTarefa;
