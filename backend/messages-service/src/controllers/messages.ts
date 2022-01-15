import { Request, Response } from 'express';

import { IMessage } from '@models/message';
import { add, findAll, findById, set } from '@models/messageRepository';
import { Token } from '@ms-commons/api/auth';
import { getToken } from '@ms-commons/api/controllers/controller';

async function getMessages(_req: Request, res: Response, _next: any) {
	try {
		const { accountId } = getToken(res) as Token;

		const messages = await findAll(accountId);

		res.status(200).json(messages); //* OK
	} catch (error) {
		console.error(`getMessages: ${error}`);

		res.sendStatus(400); //! Bad Request
	}
}

export { getMessages };
