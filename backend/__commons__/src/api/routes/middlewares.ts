import { Request, Response } from 'express';
import Joi from 'joi';

import auth from '../auth';

function validateSchema(
	schema: Joi.ObjectSchema<any>,
	{ body }: Request,
	res: Response,
	next: any
) {
	const { error } = schema.validate(body);

	if (error === undefined) return next();

	const { details } = error;

	const message = details.map((item) => item.message).join(',');

	console.log(message);

	return res.status(422).end(); //! Unprocessable Entity
}

async function validateAuth({ headers }: Request, res: Response, next: any) {
	try {
		const token = headers['x-access-token'] as string;

		if (!token) return res.status(401).end(); //! Unauthorized

		const payload = await auth.verify(token);

		if (!payload) return res.status(401).end(); //! Unauthorized

		res.locals.payload = payload;

		return next();
	} catch (error) {
		console.error(`validateAuth: ${error}`);

		return res.status(401).end(); //! Unauthorized
	}
}

export { validateSchema, validateAuth };
