import { Router } from 'express';

import {
	getContacts,
	getContact,
	addContact,
	setContact,
	deleteContact,
} from '@controllers/contacts';
import {
	validateAccountAuth,
	validateMicroserviceAuth,
} from '@ms-commons/api/routes/middlewares';

import {
	validateContactSchema,
	validateUpdateContactSchema,
} from './middlewares';

const router = Router();

/**
 * GET /contacts/:id/account/:accountId
 * Only microservices call this route
 * Returns one contact from the account
 */
router.get(
	'/contacts/:id/account/:accountId',
	validateMicroserviceAuth,
	getContact
);

/**
 * GET /contacts/:id
 * Returns one contact from the account
 */
router.get('/contacts/:id', validateAccountAuth, getContact);

/**
 * GET /contacts/
 * Return all contacts from the account
 */
router.get('/contacts/', validateAccountAuth, getContacts);

/**
 * POST /contacts/
 * Save a contact to an account
 */
router.post(
	'/contacts/',
	validateAccountAuth,
	validateContactSchema,
	addContact
);

/**
 * PATCH /contacts/:id
 * Updates a contact from the account
 */
router.patch(
	'/contacts/:id',
	validateAccountAuth,
	validateUpdateContactSchema,
	setContact
);

/**
 * DELETE /contacts/:id
 * Remove one contact from the account
 */
router.delete('/contacts/:id', validateAccountAuth, deleteContact);

export default router;
