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
	validateMSAuthentication,
} from '@routes/middlewares';

const router = Router();

/**
 * GET /accounts/settings/accountEmails
 * Returns all accountEmails from the account settings
 */
router.get(
	'/accounts/settings/accountEmails',
	validateAuthentication,
	getAccountEmails
);

/**
 * GET /accounts/settings/accountEmails/:accountEmailId
 * Returns one accountEmail from the account settings
 */
router.get(
	'/accounts/settings/accountEmails/:accountEmailId',
	validateAuthentication,
	getAccountEmail
);

/**
 * GET /accounts/settings
 * Returns all settings from this account
 */
router.get('/accounts/settings', validateAuthentication, getAccountSettings);

/**
 * GET /accounts/:accountId/accountEmails/:accountEmailId
 * Microservice call to get an accountEmail from an account
 */
router.get(
	'/accounts/:accountId/accountEmails/:accountEmailId',
	validateMSAuthentication,
	getAccountEmail
);

/**
 * GET /accounts/:id
 * Returns one account
 */
router.get(
	'/accounts/:id',
	validateAuthentication,
	validateAuthorization,
	getAccount
);

/**
 * GET /accounts/
 * Returns all accounts
 */
router.get('/accounts/', validateAuthentication, getAccounts);

/**
 * PATCH /accounts/:id
 * Update the account
 */
router.patch(
	'/accounts/:id',
	validateAuthentication,
	validateAuthorization,
	validateUpdateAccountSchema,
	setAccount
);

/**
 * PATCH /accounts/settings/accountEmails/:id
 * Updates one accountEmail from the account
 */
router.patch(
	'/accounts/settings/accountEmails/:id',
	validateAuthentication,
	validateAccountEmailUpdateSchema,
	setAccountEmail
);

/**
 * PUT /accounts/settings/accountEmails
 * Add one accountEmail to the account settings
 */
router.put(
	'/accounts/settings/accountEmails',
	validateAuthentication,
	validateAccountEmailSchema,
	addAccountEmail
);

/**
 * POST /accounts/settings
 * Create the account settings or return if it already exits
 * ?force=true to be sure that will be recreated
 */
router.post(
	'/accounts/settings',
	validateAuthentication,
	createAccountSettings
);

/**
 * POST /accounts/
 * Open route to create a new account
 */
router.post('/accounts/', validateAccountSchema, addAccount);

/**
 * POST /accounts/login
 * Do login
 */
router.post('/accounts/login', validateLoginSchema, loginAccount);

/**
 * POST /accounts/logout
 * Do logout
 */
router.post('/accounts/logout', validateAuthentication, logoutAccount);

/**
 * DELETE /accounts/:id
 * Soft-delete the account
 * ?force=true to really remove
 */
router.delete(
	'/accounts/:id',
	validateAuthentication,
	validateAuthorization,
	deleteAccount
);

/**
 * DELETE /accounts/settings/accountEmails/:id
 * Remove the accountEmail from the account settings
 */
router.delete(
	'/accounts/settings/accountEmails/:id',
	validateAuthentication,
	deleteAccountEmail
);

router.get('/health', ({ body }, res) => {
	res.json({ name: 'accounts-service', echo: `${body}` });
});

export default router;
