import { Router } from 'express';

import {
	getMessages,
	getMessage,
	addMessage,
	setMessage,
	deleteMessage,
	scheduleMessage,
	sendMessage,
} from '@controllers/messages';
import {
	validateAccountAuth,
	validateMicroserviceAuth,
} from '@ms-commons/api/routes/middlewares';

import {
	validateMessageSchema,
	validateUpdateMessageSchema,
	validateSendingSchema,
} from './middlewares';

const router = Router();

/**
 * GET /messages/:id
 * Returns one message from this account
 */
router.get('/messages/:id', validateAccountAuth, getMessage);

/**
 * GET /messages/
 * Returns all messages from this account
 */
router.get('/messages/', validateAccountAuth, getMessages);

/**
 * POST /messages/
 * Add one message to this account
 */
router.post(
	'/messages/',
	validateAccountAuth,
	validateMessageSchema,
	addMessage
);

/**
 * PATCH /messages/:id
 * Updates one message from this account
 */
router.patch(
	'/messages/:id',
	validateAccountAuth,
	validateUpdateMessageSchema,
	setMessage
);

/**
 * DELETE /messages/:id
 * Remove one message from this account
 */
router.delete('/messages/:id', validateAccountAuth, deleteMessage);

/**
 * POST /messages/:id/send
 * Front-end calls this route to send a message to a bunch of contacts.
 * In fact, the messages will be queued.
 */
router.post('/messages/:id/send', validateAccountAuth, scheduleMessage);

/**
 * POST /messages/send
 * AWS Lambda calls this route to send a message from the queue to one contact.
 * The back-end will send the email.
 */
router.post(
	'/messages/sending',
	validateMicroserviceAuth,
	validateSendingSchema,
	sendMessage
);

export default router;
