import { Request, Response } from 'express';

import {
	accountSchema,
	accountUpdateSchema,
	loginSchema,
} from '@models/accountSchemas';
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

async function validateAuth(req: Request, res: Response, next: any) {
	return commonsMiddleware.validateAuth(req, res, next);
}

export {
	validateAccountSchema,
	validateUpdateAccountSchema,
	validateLoginSchema,
	validateAuth,
};
