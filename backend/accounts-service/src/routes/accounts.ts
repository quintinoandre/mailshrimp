import { Router } from 'express';

import {
	getAccounts,
	getAccount,
	setAccount,
	addAccount,
	loginAccount,
	logoutAccount,
	deleteAccount,
	getAccountSettings,
	createAccountSettings,
	addAccountEmail,
} from '@controllers/accounts';
import {
	validateAccountSchema,
	validateUpdateAccountSchema,
	validateLoginSchema,
	validateAuthentication,
	validateAuthorization,
	validateAccountEmailSchema,
} from '@routes/middlewares';

const router = Router();

router.get('/accounts/settings', validateAuthentication, getAccountSettings);

router.get(
	'/accounts/:id',
	validateAuthentication,
	validateAuthorization,
	getAccount
);

router.get('/accounts/', validateAuthentication, getAccounts);

router.patch(
	'/accounts/:id',
	validateAuthentication,
	validateAuthorization,
	validateUpdateAccountSchema,
	setAccount
);

router.put(
	'accounts/settings/accountEmails',
	validateAuthentication,
	validateAccountEmailSchema,
	addAccountEmail
);

router.post(
	'/accounts/settings',
	validateAuthentication,
	createAccountSettings
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
