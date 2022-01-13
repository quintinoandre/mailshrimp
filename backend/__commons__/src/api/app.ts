import cors from 'cors';
import express, { Router } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

export default (router: Router) => {
	const app = express();

	app.use(morgan('dev'));

	app.use(helmet());

	app.use(cors());

	app.use(express.json());

	app.use(router);

	return app;
};
