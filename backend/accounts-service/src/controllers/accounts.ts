import { Request, Response } from 'express';

import {
	findAll,
	findByEmail,
	findById,
	add,
	set,
} from '@models/accountRepository';
import { IAccount } from '@models/accounts';

import { comparePassword, hashPassword, sign } from '../auth';

async function getAccounts(_req: Request, res: Response, _next: any) {
	const accounts = await findAll();

	res.json(
		accounts.map((item) => {
			const account = item;

			delete account.get({ plain: true }).password;

			return account;
		})
	);
}

async function getAccount({ params }: Request, res: Response, _next: any) {
	try {
		const id = parseInt(params.id);

		if (!id) throw new Error('id is in invalid format!');

		const account = await findById(id);

		if (!account) return res.status(404).end(); //! Not Found

		delete account.get({ plain: true }).password;

		return res.json(account);
	} catch (error) {
		console.log(error);

		return res.status(400).end(); //! Bad Request
	}
}

async function addAccount({ body }: Request, res: Response, _next: any) {
	try {
		const newAccount = body as IAccount;

		newAccount.password = hashPassword(newAccount.password);

		const result = await add(newAccount);

		delete result.get({ plain: true }).password;

		res.status(201).json(result); //! Created
	} catch (error) {
		console.log(error);

		res.status(400).end(); //! Bad Request
	}
}

async function setAccount(
	{ body, params }: Request,
	res: Response,
	_next: any
) {
	try {
		const id = parseInt(params.id);

		if (!id) throw new Error('id is in invalid format!');

		const accountParams = body as IAccount;

		accountParams.password = hashPassword(accountParams.password);

		const updatedAccount = await set(id, accountParams);

		delete updatedAccount.get({ plain: true }).password;

		return res.status(200).json(updatedAccount); //* OK
	} catch (error) {
		console.log(error);

		return res.status(400).end(); //! Bad Request
	}
}

async function loginAccount({ body }: Request, res: Response, _next: any) {
	try {
		const loginParams = body as IAccount;

		const { email, password: loginPassword } = loginParams;

		const account = await findByEmail(email);

		const { id, password: accountPassword } = account;

		if (account) {
			const isValid = comparePassword(loginPassword, accountPassword);

			if (isValid) {
				const token = sign(id!);

				return res.json({ auth: true, token });
			}
		}

		return res.status(401).end(); //! Unauthorized
	} catch (error) {
		console.log(`loginAccount: ${error}`);

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
