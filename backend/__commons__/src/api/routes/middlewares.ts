import { Request, Response } from 'express';
import Joi from 'joi';

import accountsAuth from '../auth/accountsAuth';
import microservicesAuth from '../auth/microservicesAuth';

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

async function validateAccountAuth(
	{ headers }: Request,
	res: Response,
	next: any
) {
	try {
		const token = headers['x-access-token'] as string;

		if (!token) return res.sendStatus(401); //! Unauthorized

		const payload = await accountsAuth.verify(token);

		if (!payload) return res.sendStatus(401); //! Unauthorized

		res.locals.payload = payload;

		return next();
	} catch (error) {
		console.error(`validateAccountAuth: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function validateMicroserviceAuth(
	{ headers }: Request,
	res: Response,
	next: any
) {
	try {
		const token = headers['x-access-token'] as string;

		if (!token) return res.sendStatus(401); //! Unauthorized

		const payload = await microservicesAuth.verify(token);

		if (!payload) return res.sendStatus(401); //! Unauthorized

		res.locals.payload = payload;

		return next();
	} catch (error) {
		console.error(`validatMicroserviceAuth: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

export { validateSchema, validateAccountAuth, validateMicroserviceAuth };
