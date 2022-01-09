import { Router } from 'express';

import { getContacts } from '@controllers/contacts';
import { validateAuth } from '@ms-commons/api/routes/middlewares';

const router = Router();

router.get('/contacts/', validateAuth, getContacts);

export default router;
