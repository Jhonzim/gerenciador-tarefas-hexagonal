import React from 'react';
import './App.css';
import ListaTarefas from './componentes/ListaTarefas';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Gerenciador de Tarefas</h1>
      </header>
      <main>
        <ListaTarefas />
      </main>
      <footer>
        <p>Desenvolvido com Arquitetura Hexagonal - 2023</p>
      </footer>
    </div>
  );
}

export default App;
