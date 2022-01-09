import express, { Router } from 'express';
import helmet from 'helmet';

export default (router: Router) => {
	const app = express();

	app.use(helmet());

	app.use(express.json());

	app.use(router);

	return app;
};
