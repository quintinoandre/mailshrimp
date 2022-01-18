import { Request, Response } from 'express';

import {
	accountEmailSchema,
	accountEmailUpdateSchema,
} from '@models/accountEmailShcemas';
import {
	accountSchema,
	accountUpdateSchema,
	loginSchema,
} from '@models/accountSchemas';
import { Token } from '@ms-commons/api/auth/accountsAuth';
import { getToken } from '@ms-commons/api/controllers/controller';
import {
	validateSchema,
	validateAccountAuth,
} from '@ms-commons/api/routes/middlewares';

function validateAccountEmailSchema(req: Request, res: Response, next: any) {
	return validateSchema(accountEmailSchema, req, res, next);
}

function validateAccountEmailUpdateSchema(
	req: Request,
	res: Response,
	next: any
) {
	return validateSchema(accountEmailUpdateSchema, req, res, next);
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

async function validateAuthentication(req: Request, res: Response, next: any) {
	return validateAccountAuth(req, res, next);
}

function validateAuthorization(
	{ params: { id } }: Request,
	res: Response,
	next: any
) {
	const accountId = parseInt(id);

	if (!accountId) return res.sendStatus(400); //! Bad Request

	const token = getToken(res) as Token;

	if (accountId !== token.accountId) return res.sendStatus(403); //! Forbidden

	return next();
}

export {
	validateAccountEmailSchema,
	validateAccountEmailUpdateSchema,
	validateAccountSchema,
	validateUpdateAccountSchema,
	validateLoginSchema,
	validateAuthentication,
	validateAuthorization,
};
