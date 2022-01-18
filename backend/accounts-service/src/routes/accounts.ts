import { Router } from 'express';

import {
	getAccounts,
	getAccount,
	setAccountEmail,
	setAccount,
	addAccount,
	loginAccount,
	logoutAccount,
	deleteAccount,
	deleteAccountEmail,
	getAccountEmails,
	getAccountEmail,
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
	validateAccountEmailUpdateSchema,
} from '@routes/middlewares';

const router = Router();

router.get(
	'/accounts/settings/accountEmails',
	validateAuthentication,
	getAccountEmails
);

router.get(
	'/accounts/settings/accountEmails/:id',
	validateAuthentication,
	getAccountEmail
);

router.get('/accounts/settings', validateAuthentication, getAccountSettings);

router.get(
	'/accounts/:id',
	validateAuthentication,
	validateAuthorization,
	getAccount
);

router.get('/accounts/', validateAuthentication, getAccounts);

router.patch(
	'/accounts/settings/accountEmails/:id',
	validateAuthentication,
	validateAccountEmailUpdateSchema,
	setAccountEmail
);

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

router.delete(
	'/accounts/settings/accountEmails/:id',
	validateAuthentication,
	deleteAccountEmail
);

router.get('/health', ({ body }, res) => {
	res.json({ name: 'accounts-service', echo: `${body}` });
});

export default router;
