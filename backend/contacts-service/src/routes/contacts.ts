import { Router } from 'express';

import {
	getContacts,
	getContact,
	addContact,
	setContact,
} from '@controllers/contacts';
import { validateAuth } from '@ms-commons/api/routes/middlewares';

import {
	validateContactSchema,
	validateUpdateContactSchema,
} from './middlewares';

const router = Router();

router.get('/contacts/:id', validateAuth, getContact);

router.get('/contacts/', validateAuth, getContacts);

router.post('/contacts/', validateAuth, validateContactSchema, addContact);

router.patch(
	'/contacts/:id',
	validateAuth,
	validateUpdateContactSchema,
	setContact
);

export default router;
