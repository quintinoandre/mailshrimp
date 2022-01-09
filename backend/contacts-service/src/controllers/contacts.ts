import { Request, Response } from 'express';

async function getContacts(req: Request, res: Response, _next: any) {
	res.json([]);
}

export { getContacts };
