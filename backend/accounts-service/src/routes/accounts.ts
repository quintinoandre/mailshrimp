import { Router } from 'express';

import {
	getAccounts,
	getAccount,
	setAccount,
	addAccount,
	loginAccount,
	logoutAccount,
	deleteAccount,
} from '@controllers/accounts';
import {
	validateAccountSchema,
	validateUpdateAccountSchema,
	validateLoginSchema,
	validateAuthentication,
	validateAuthorization,
} from '@routes/middlewares';

const router = Router();

router.get('/accounts/', validateAuthentication, getAccounts);

router.get(
	'/accounts/:id',
	validateAuthentication,
	validateAuthorization,
	getAccount
);

router.patch(
	'/accounts/:id',
	validateAuthentication,
	validateAuthorization,
	validateUpdateAccountSchema,
	setAccount
);

router.post('/accounts/', validateAccountSchema, addAccount);

router.post('/accounts/login', validateLoginSchema, loginAccount);

router.post('/accounts/logout', validateAuthentication, logoutAccount);

router.delete(
	'/accounts/:id',
	validateAuthentication,
	validateAuthorization,
	deleteAccount
);

export default router;
