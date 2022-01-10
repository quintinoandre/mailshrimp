import { Router } from 'express';

import { getContacts, getContact, addContact } from '@controllers/contacts';
import { validateAuth } from '@ms-commons/api/routes/middlewares';

import { validateContactSchema } from './middlewares';

const router = Router();

router.get('/contacts/:id', validateAuth, getContact);

router.get('/contacts/', validateAuth, getContacts);

router.post('/contacts/', validateAuth, validateContactSchema, addContact);

export default router;
