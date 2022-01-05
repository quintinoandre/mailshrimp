import { Request, Response } from 'express';

import { IAccount } from '@models/accounts';

const accounts: IAccount[] = [];

function getAccounts(_req: Request, res: Response, _next: any) {
	res.json(accounts);
}

function getAccount({ params }: Request, res: Response, _next: any) {
	try {
		const { id } = params;

		const index = accounts.findIndex((item) => item.id === parseInt(id));

		if (index === -1) return res.status(404).end(); //! Not Found

		return res.json(accounts[index]);
	} catch (error) {
		console.log(error);

		return res.status(400).end(); //! Bad Request
	}
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

export { getAccounts, getAccount, addAccount };
