import { Response } from 'express';

import { Token } from '../auth/accountsAuth';

function getToken(res: Response) {
	const payload = res.locals.payload as Token;

	if (!payload || !payload.accountId) return res.sendStatus(401); //! Unauthorized

	return payload;
}

export { getToken };
