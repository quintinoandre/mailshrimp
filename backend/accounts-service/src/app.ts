import express from 'express';
import helmet from 'helmet';

import accountsRouter from '@routes/accounts';

const { PORT } = process.env;

const app = express();

app.use(helmet());

app.use(express.json());

app.use(accountsRouter);

app.listen(PORT);

console.log(`Running on port ${PORT}!`);
