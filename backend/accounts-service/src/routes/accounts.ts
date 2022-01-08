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
	validateAccount,
	validateUpdateAccount,
	validateLogin,
	validateAuth,
} from '@routes/middlewares';

const router = Router();

router.get('/accounts/', validateAuth, getAccounts);

router.get('/accounts/:id', validateAuth, getAccount);

router.patch('/accounts/:id', validateAuth, validateUpdateAccount, setAccount);

router.post('/accounts/', validateAccount, addAccount);

router.post('/accounts/login', validateLogin, loginAccount);

router.post('/accounts/logout', validateAuth, logoutAccount);

export default router;
