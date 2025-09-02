import { createPool, Pool } from 'mysql2/promise';

async function inicializarBancoDeDados(pool: Pool): Promise<void> {
  const sql = `
    CREATE TABLE IF NOT EXISTS tarefas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descricao TEXT NULL,
      status ENUM('pendente','em_andamento','concluida') NOT NULL DEFAULT 'pendente',
      prioridade ENUM('baixa','media','alta') NOT NULL DEFAULT 'media',
      data_vencimento DATE NULL,
      data_criacao DATETIME NOT NULL,
      data_atualizacao DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  try {
    await pool.query(sql);
    console.log('[DB] Schema do banco de dados inicializado com sucesso.');
  } catch (err: any) {
    console.error('[DB] Falha ao inicializar o schema:', err.message);
    throw err; 
  }
}

export function criarConexao(): Pool {
  try {
    const pool = createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'tarefas_db',
      waitForConnections: true,
      connectionLimit: 10
    });

    (async () => {
      try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        console.log('[DB] Conectado ao MySQL com sucesso.');
        await inicializarBancoDeDados(pool);
      } catch (err: any) {
        console.warn('[DB] Falha na conexão inicial ou setup do schema:', err?.message);
      }
    })();

    return pool;
  } catch (err: any) {
    console.error('[DB] Erro fatal ao criar o pool de conexões:', err?.message);
    throw err;
  }
}
