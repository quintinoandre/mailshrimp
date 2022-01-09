import { Response } from 'express';

import { Token } from '../auth';

function getToken(res: Response) {
	const payload = res.locals.payload as Token;

	if (!payload || !payload.accountId) return res.status(401).end(); //! Unauthorized

	return payload;
}

export { getToken };
