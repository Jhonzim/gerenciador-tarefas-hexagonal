import mysql from 'mysql2/promise';

export async function criarConexao() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'tarefas_user',
    password: process.env.DB_PASSWORD || 'tarefas_password',
    database: process.env.DB_DATABASE || 'tarefas_db'
  });

  return connection;
}

export async function inicializarBancoDeDados(connection: mysql.Connection) {
  const criarTabelaTarefas = `
    CREATE TABLE IF NOT EXISTS tarefas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descricao TEXT,
      status ENUM('pendente', 'em_andamento', 'concluida') DEFAULT 'pendente',
      prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',
      data_vencimento DATETIME,
      data_criacao DATETIME NOT NULL,
      data_atualizacao DATETIME NOT NULL
    )
  `;

  await connection.execute(criarTabelaTarefas);
  console.log('Banco de dados inicializado com sucesso');
}
