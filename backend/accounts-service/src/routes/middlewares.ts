import { Request, Response } from 'express';

import {
	accountSchema,
	accountUpdateSchema,
	loginSchema,
} from '@models/accountSchemas';
import { Token } from '@ms-commons/api/auth';
import { getToken } from '@ms-commons/api/controllers/controller';
import commonsMiddleware from '@ms-commons/api/routes/middlewares';

function validateAccountSchema(req: Request, res: Response, next: any) {
	return commonsMiddleware.validateSchema(accountSchema, req, res, next);
}

function validateUpdateAccountSchema(req: Request, res: Response, next: any) {
	return commonsMiddleware.validateSchema(accountUpdateSchema, req, res, next);
}

function validateLoginSchema(req: Request, res: Response, next: any) {
	return commonsMiddleware.validateSchema(loginSchema, req, res, next);
}

async function validateAuthentication(req: Request, res: Response, next: any) {
	return commonsMiddleware.validateAuth(req, res, next);
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
