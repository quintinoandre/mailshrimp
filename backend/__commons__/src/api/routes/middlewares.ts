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

	console.log(`validateSchema: ${message}`);

	return res.status(422).json({ entity: body, message }); //! Unprocessable Entity
}

async function validateAuth({ headers }: Request, res: Response, next: any) {
	try {
		const token = headers['x-access-token'] as string;

		if (!token) return res.sendStatus(401); //! Unauthorized

		const payload = await auth.verify(token);

		if (!payload) return res.sendStatus(401); //! Unauthorized

		res.locals.payload = payload;

		return next();
	} catch (error) {
		console.error(`validateAuth: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

export { validateSchema, validateAuth };
