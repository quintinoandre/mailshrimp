import express from 'express';
import helmet from 'helmet';

import accountsRouter from '@routes/accounts';

const app = express();

app.use(helmet());

app.use(express.json());

app.use(accountsRouter);

export default app;
