import { Router, Request, Response } from 'express';
import Joi from 'joi';

import {
	getAccounts,
	getAccount,
	setAccount,
	addAccount,
	loginAccount,
	logoutAccount,
} from '@controllers/accounts';
import { accountSchema, loginSchema } from '@models/accounts';

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

function validateAccount(req: Request, res: Response, next: any) {
	return validateSchema(accountSchema, req, res, next);
}

function validateLogin(req: Request, res: Response, next: any) {
	return validateSchema(loginSchema, req, res, next);
}

const router = Router();

router.get('/accounts/', getAccounts);

router.get('/accounts/:id', getAccount);

router.patch('/accounts/:id', validateAccount, setAccount);

router.post('/accounts/', validateAccount, addAccount);

router.post('/accounts/login', validateLogin, loginAccount);

router.post('/accounts/logout', logoutAccount);

export default router;
