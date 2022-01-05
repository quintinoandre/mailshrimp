import { Router } from 'express';

import { getAccounts, addAccount } from '@controllers/accounts';

const router = Router();

router.get('/', getAccounts);

router.post('/', addAccount);

export default router;
