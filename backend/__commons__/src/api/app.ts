import cors from 'cors';
import express, { Router } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const { CORS_ORIGIN, MS_NAME } = process.env;

function getCorsOrigin() {
	if (!CORS_ORIGIN) throw new Error('CORS_ORIGIN is required env var!');

	if (CORS_ORIGIN === '*') return CORS_ORIGIN;

	return new RegExp(CORS_ORIGIN);
}

export default (router: Router) => {
	const app = express();

	app.use(morgan('dev'));

	app.use(helmet());

	const corsOptions = {
		origin: getCorsOrigin(),
		optionsSuccessStatus: 200,
	};

	app.use(cors(corsOptions));

	app.use(express.json());

	app.use(router);

	app.get('/health', (_req, res) => {
		res.json({ message: `${MS_NAME} is up and running!` });
	});

	return app;
};
