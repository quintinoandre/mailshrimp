import { Request, Response } from 'express';

import { findAll } from '@models/contactRepository';
import { Token } from '@ms-commons/api/auth';
import { getToken } from '@ms-commons/api/controllers/controller';

async function getContacts(_req: Request, res: Response, _next: any) {
	const token = getToken(res) as Token;

	const contacts = await findAll(token.accountId);

	res.json(contacts);
}

export { getContacts };
