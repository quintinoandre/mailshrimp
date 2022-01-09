import { Router } from 'express';

import { getContacts } from '@controllers/contacts';
import middlewareCommons from '@ms-commons/api/routes/middlewares';

const router = Router();

router.get('/contacts/', middlewareCommons.validateAuth, getContacts);

export default router;
