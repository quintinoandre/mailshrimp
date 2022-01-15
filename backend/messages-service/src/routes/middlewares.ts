import { Request, Response } from 'express';

import { messageSchema, messageUpdateSchema } from '@models/messageSchemas';
import { validateSchema } from '@ms-commons/api/routes/middlewares';

function validateMessageSchema(req: Request, res: Response, next: any) {
	return validateSchema(messageSchema, req, res, next);
}

function validateUpdateMessageSchema(req: Request, res: Response, next: any) {
	return validateSchema(messageUpdateSchema, req, res, next);
}

export { validateMessageSchema, validateUpdateMessageSchema };
