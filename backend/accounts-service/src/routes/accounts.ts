import { Router, Request, Response } from 'express';

import { getAccounts, getAccount, addAccount } from '@controllers/accounts';
import { accountSchema } from '@models/accounts';

function validateAccount({ body }: Request, res: Response, next: any) {
	const { error } = accountSchema.validate(body);

	if (error === undefined) return next();

	const { details } = error;

	const message = details.map((item) => item.message).join(',');

	console.log(message);

	return res.status(422).end(); //! Unprocessable Entity
}

const router = Router();

router.get('/accounts/', getAccounts);

router.get('/accounts/:id', getAccount);

router.post('/accounts/', validateAccount, addAccount);

export default router;
