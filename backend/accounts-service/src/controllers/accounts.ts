import { Request, Response } from 'express';

import { IAccount } from '@models/accounts';

const accounts: IAccount[] = [];

function getAccounts(_req: Request, res: Response, _next: any) {
	res.json(accounts);
}

function addAccount({ body }: Request, res: Response, _next: any) {
	try {
		const newAccount = body as IAccount;

		accounts.push(newAccount);

		res.status(201).json(newAccount); //! Created
	} catch (error) {
		console.log(error);

		res.status(400).end(); //! Bad Request
	}
}

export { getAccounts, addAccount };
