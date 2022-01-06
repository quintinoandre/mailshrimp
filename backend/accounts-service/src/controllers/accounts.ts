import { Request, Response } from 'express';

import { IAccount } from '@models/accounts';

const accounts: IAccount[] = [];

function getAccounts(_req: Request, res: Response, _next: any) {
	res.json(accounts);
}

function getAccount({ params }: Request, res: Response, _next: any) {
	try {
		const id = parseInt(params.id);

		if (!id) throw new Error('id is in invalid format!');

		const index = accounts.findIndex((item) => item.id === id);

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

function setAccount({ body, params }: Request, res: Response, _next: any) {
	try {
		const id = parseInt(params.id);

		if (!id) throw new Error('id is in invalid format!');

		const accountParams = body as IAccount;

		const index = accounts.findIndex((item) => item.id === id);

		if (index === -1) return res.status(404).end(); //! Not Found

		const originalAccount = accounts[index];

		if (accountParams.name) originalAccount.name = accountParams.name;

		if (accountParams.password)
			originalAccount.password = accountParams.password;

		accounts[index] = originalAccount;

		return res.status(200).json(originalAccount); //* OK
	} catch (error) {
		console.log(error);

		return res.status(400).end(); //! Bad Request
	}
}

function loginAccount({ body }: Request, res: Response, _next: any) {
	try {
		const loginParams = body as IAccount;

		const index = accounts.findIndex(
			(item) =>
				item.email === loginParams.email &&
				item.password === loginParams.password
		);

		if (index === -1) return res.status(401).end(); //! Unauthorized

		return res.json({ auth: true, token: {} });
	} catch (error) {
		console.log(error);

		return res.status(400).end(); //! Bad Request
	}
}

function logoutAccount(req: Request, res: Response, _next: any) {
	res.json({ auth: false, token: null });
}

export {
	getAccounts,
	getAccount,
	addAccount,
	setAccount,
	loginAccount,
	logoutAccount,
};
