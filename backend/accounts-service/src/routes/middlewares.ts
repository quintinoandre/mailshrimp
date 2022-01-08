import { Request, Response } from 'express';
import Joi from 'joi';

import {
	accountSchema,
	accountUpdateSchema,
	loginSchema,
} from '@models/accountSchemas';

import { verify } from '../auth';

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

function validateAccountSchema(req: Request, res: Response, next: any) {
	return validateSchema(accountSchema, req, res, next);
}

function validateUpdateAccountSchema(req: Request, res: Response, next: any) {
	return validateSchema(accountUpdateSchema, req, res, next);
}

function validateLoginSchema(req: Request, res: Response, next: any) {
	return validateSchema(loginSchema, req, res, next);
}

async function validateAuth({ headers }: Request, res: Response, next: any) {
	try {
		const token = headers['x-access-token'] as string;

		if (!token) return res.status(401).end(); //! Unauthorized

		const payload = await verify(token);

		if (!payload) return res.status(401).end(); //! Unauthorized

		res.locals.payload = payload;

		return next();
	} catch (error) {
		console.log(`validateAuth: ${error}`);

		return res.status(401).end(); //! Unauthorized
	}
}

export {
	validateAccountSchema,
	validateUpdateAccountSchema,
	validateLoginSchema,
	validateAuth,
};
