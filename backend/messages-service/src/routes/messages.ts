import { Router } from 'express';

import {
	getMessages,
	getMessage,
	addMessage,
	setMessage,
} from '@controllers/messages';
import { validateAuth } from '@ms-commons/api/routes/middlewares';

import {
	validateMessageSchema,
	validateUpdateMessageSchema,
} from './middlewares';

const router = Router();

router.get('/messages/:id', validateAuth, getMessage);

router.get('/messages/', validateAuth, getMessages);

router.post('/messages/', validateAuth, validateMessageSchema, addMessage);

router.patch(
	'/messages/:id',
	validateAuth,
	validateUpdateMessageSchema,
	setMessage
);

export default router;
