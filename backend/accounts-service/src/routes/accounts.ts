import { Router } from 'express';

import {
	getAccounts,
	getAccount,
	setAccount,
	addAccount,
	loginAccount,
	logoutAccount,
} from '@controllers/accounts';
import calc from '@ms-commons/calc';
import {
	validateAccountSchema,
	validateUpdateAccountSchema,
	validateLoginSchema,
	validateAuth,
} from '@routes/middlewares';

const router = Router();

router.get('/accounts/', validateAuth, getAccounts);

router.get('/accounts/:id', validateAuth, getAccount);

router.patch(
	'/accounts/:id',
	validateAuth,
	validateUpdateAccountSchema,
	setAccount
);

router.post('/accounts/', validateAccountSchema, addAccount);

router.post('/accounts/login', validateLoginSchema, loginAccount);

router.post('/accounts/logout', logoutAccount);

router.get('/somar/:val1/:val2', (req, res, _next) => {
	const val1 = parseInt(req.params.val1);
	const val2 = parseInt(req.params.val2);
	const result = calc(val1, val2);
	res.json({ result });
});

export default router;
