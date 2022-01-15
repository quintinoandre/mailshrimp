import { Router } from 'express';

import { getMessages } from '@controllers/messages';
import { validateAuth } from '@ms-commons/api/routes/middlewares';

/* import {
	validateMessageSchema,
	validateUpdateMessageSchema,
} from './middlewares'; */

const router = Router();

router.get('/messages/', validateAuth, getMessages);

export default router;
