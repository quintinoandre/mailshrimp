import { Router } from 'express';

import {
	getAccounts,
	getAccount,
	setAccount,
	addAccount,
	loginAccount,
	logoutAccount,
} from '@controllers/accounts';
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

export default router;
