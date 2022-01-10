import { Router } from 'express';

import { getContacts, getContact } from '@controllers/contacts';
import { validateAuth } from '@ms-commons/api/routes/middlewares';

const router = Router();

router.get('/contacts/:id', validateAuth, getContact);

router.get('/contacts/', validateAuth, getContacts);

export default router;
