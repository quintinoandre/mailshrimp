import { Router } from 'express';

import { getAccounts, getAccount, addAccount } from '@controllers/accounts';

const router = Router();

router.get('/accounts/', getAccounts);

router.get('/accounts/:id', getAccount);

router.post('/accounts/', addAccount);

export default router;
