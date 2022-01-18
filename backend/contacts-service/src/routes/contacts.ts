import { Router } from 'express';

import {
	getContacts,
	getContact,
	addContact,
	setContact,
	deleteContact,
} from '@controllers/contacts';
import { validateAccountAuth } from '@ms-commons/api/routes/middlewares';

import {
	validateContactSchema,
	validateUpdateContactSchema,
} from './middlewares';

const router = Router();

router.get('/contacts/:id', validateAccountAuth, getContact);

router.get('/contacts/', validateAccountAuth, getContacts);

router.post(
	'/contacts/',
	validateAccountAuth,
	validateContactSchema,
	addContact
);

router.patch(
	'/contacts/:id',
	validateAccountAuth,
	validateUpdateContactSchema,
	setContact
);

router.delete('/contacts/:id', validateAccountAuth, deleteContact);

export default router;
