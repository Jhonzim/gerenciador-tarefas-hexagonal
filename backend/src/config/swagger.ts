import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'API Gerenciador de Tarefas',
      version: '1.0.0',
      description: 'Documentação da API do Gerenciador de Tarefas (Arquitetura Hexagonal).'
    },
    servers: [
      { url: `http://localhost:${process.env.PORT}`, description: 'Servidor Local' }
    ],
    tags: [
      { name: 'Tarefas', description: 'Operações de CRUD de tarefas' }
    ],
    components: {
      schemas: {
        Tarefa: {
          type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              titulo: { type: 'string', example: 'Estudar POO' },
              descricao: { type: 'string', example: 'Revisar conceitos de polimorfismo' },
              status: { type: 'string', enum: ['pendente', 'em_andamento', 'concluida'], example: 'pendente' },
              prioridade: { type: 'string', enum: ['baixa', 'media', 'alta'], example: 'media' },
              dataVencimento: { type: 'string', format: 'date-time', example: '2025-09-10T00:00:00.000Z' },
              dataCriacao: { type: 'string', format: 'date-time' },
              dataAtualizacao: { type: 'string', format: 'date-time' }
            }
        },
        CriarTarefaInput: {
          type: 'object',
          required: ['titulo'],
          properties: {
            titulo: { type: 'string' },
            descricao: { type: 'string' },
            status: { type: 'string', enum: ['pendente', 'em_andamento', 'concluida'] },
            prioridade: { type: 'string', enum: ['baixa', 'media', 'alta'] },
            dataVencimento: { type: 'string', format: 'date' }
          }
        },
        AtualizarTarefaInput: {
          type: 'object',
          properties: {
            titulo: { type: 'string' },
            descricao: { type: 'string' },
            status: { type: 'string', enum: ['pendente', 'em_andamento', 'concluida'] },
            prioridade: { type: 'string', enum: ['baixa', 'media', 'alta'] },
            dataVencimento: { type: 'string', format: 'date' }
          }
        },
        Erro: {
          type: 'object',
          properties: {
            mensagem: { type: 'string', example: 'Erro ao criar tarefa' }
          }
        }
      }
    }
  },
  apis: [
    './src/adaptadores/rotas/*.ts'
  ]
});
