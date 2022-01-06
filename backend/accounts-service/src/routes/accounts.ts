import { Router } from 'express';

import {
	getAccounts,
	getAccount,
	setAccount,
	addAccount,
	loginAccount,
	logoutAccount,
} from '@controllers/accounts';
import { validateAccount, validateLogin } from '@routes/middlewares';

const router = Router();

router.get('/accounts/', getAccounts);

router.get('/accounts/:id', getAccount);

router.patch('/accounts/:id', validateAccount, setAccount);

router.post('/accounts/', validateAccount, addAccount);

router.post('/accounts/login', validateLogin, loginAccount);

router.post('/accounts/logout', logoutAccount);

export default router;
