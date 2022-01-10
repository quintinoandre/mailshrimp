import { Request, Response } from 'express';

import {
	accountSchema,
	accountUpdateSchema,
	loginSchema,
} from '@models/accountSchemas';
import { Token } from '@ms-commons/api/auth';
import { getToken } from '@ms-commons/api/controllers/controller';
import {
	validateSchema,
	validateAuth,
} from '@ms-commons/api/routes/middlewares';

function validateAccountSchema(req: Request, res: Response, next: any) {
	return validateSchema(accountSchema, req, res, next);
}

function validateUpdateAccountSchema(req: Request, res: Response, next: any) {
	return validateSchema(accountUpdateSchema, req, res, next);
}

function validateLoginSchema(req: Request, res: Response, next: any) {
	return validateSchema(loginSchema, req, res, next);
}

async function validateAuthentication(req: Request, res: Response, next: any) {
	return validateAuth(req, res, next);
}

function validateAuthorization({ params }: Request, res: Response, next: any) {
	const id = parseInt(params.id);

	if (!id) return res.status(400).end(); //! Bad Request

	const token = getToken(res) as Token;

	if (id !== token.accountId) return res.status(403).end(); //! Forbidden

	return next();
}

export {
	validateAccountSchema,
	validateUpdateAccountSchema,
	validateLoginSchema,
	validateAuthentication,
	validateAuthorization,
};
