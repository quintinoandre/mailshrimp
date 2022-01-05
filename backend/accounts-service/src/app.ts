import express from 'express';
import helmet from 'helmet';

const { PORT } = process.env;

const app = express();

app.use(helmet());

app.use(express.json);

app.listen(PORT);

console.log(`Running on port ${PORT}!`);

console.log('test');
