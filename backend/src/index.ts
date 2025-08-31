import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { container } from './bootstrap/container';
import { montarTarefaRotas } from './adaptadores/rotas/tarefaRotas';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

import { ehErroAplicacao } from './dominio/erros/ErroAplicacao';

const app = express();
app.use(cors());
app.use(express.json());

// Rotas de tarefas
app.use('/api/tarefas', montarTarefaRotas(container.controladores));

// Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
	explorer: true,
	customSiteTitle: 'Documentação API Tarefas'
}));

// Health
app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// 404
app.use((req, res, next) => {
	if (req.path.startsWith('/api/')) return res.status(404).json({ mensagem: 'Rota não encontrada' });
	next();
});

// Erros
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
	if (ehErroAplicacao(err)) return res.status(err.status).json({ mensagem: err.message, detalhes: err.detalhes });
	console.error('[ERRO NÃO TRATADO]', err);
	return res.status(500).json({ mensagem: 'Erro interno' });
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
	console.log(`API ouvindo em http://localhost:${PORT}`);
	console.log(`Swagger: http://localhost:${PORT}/api/docs`);
});
