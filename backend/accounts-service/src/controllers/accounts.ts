import { Request, Response } from 'express';

import {
	findAll,
	findByEmail,
	findById,
	add,
	set,
	remove,
} from '@models/accountRepository';
import { IAccount } from '@models/accounts';
import { Token } from '@ms-commons/api/auth';
import { getToken } from '@ms-commons/api/controllers/controller';

import { comparePassword, hashPassword, sign } from '../auth';

async function getAccounts(_req: Request, res: Response, _next: any) {
	const accounts = await findAll();

	res.json(
		accounts.map((item) => {
			const account = item;

			account.password = '';

			return account;
		})
	);
}

async function getAccount({ params }: Request, res: Response, _next: any) {
	try {
		const id = parseInt(params.id);

		if (!id) return res.status(400).end(); //! Bad Request

		const token = getToken(res) as Token;

		if (id !== token.accountId) return res.status(403).end(); //! Forbidden

		const account = await findById(id);

		if (!account) return res.status(404).end(); //! Not Found

		account.password = '';

		return res.json(account); //* OK
	} catch (error) {
		console.error(`getAccount: ${error}`);

		return res.status(400).end(); //! Bad Request
	}
}

async function addAccount({ body }: Request, res: Response, _next: any) {
	try {
		const newAccount = body as IAccount;

		newAccount.password = hashPassword(newAccount.password);

		const result = await add(newAccount);

		result.password = '';

		res.status(201).json(result); //* Created
	} catch (error) {
		console.error(`addAccount: ${error}`);

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

		if (!id) return res.status(400).end(); //! Bad Request

		const token = getToken(res) as Token;

		if (id !== token.accountId) return res.status(403).end(); //! Forbidden

		const accountParams = body as IAccount;

		const { password } = accountParams;

		if (password) accountParams.password = hashPassword(password);

		const updatedAccount = await set(id, accountParams);

		if (updatedAccount) {
			updatedAccount.password = '';

			return res.status(200).json(updatedAccount); //* OK
		}

		return res.status(404).end(); //! Not Found
	} catch (error) {
		console.error(`setAccount: ${error}`);

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
				const token = sign(id);

				return res.json({ auth: true, token }); //* OK
			}
		}

		return res.status(401).end(); //! Unauthorized
	} catch (error) {
		console.error(`loginAccount: ${error}`);

		return res.status(400).end(); //! Bad Request
	}
}

function logoutAccount(req: Request, res: Response, _next: any) {
	res.json({ auth: false, token: null }); //* OK
}

async function deleteAccount({ params }: Request, res: Response, _next: any) {
	try {
		const id = parseInt(params.id);

		if (!id) return res.status(400).end(); //! Bad Request

		const token = getToken(res) as Token;

		if (id !== token.accountId) return res.status(403).end(); //! Forbidden

		await remove(id);

		return res.status(200).end(); // * OK
	} catch (error) {
		console.error(`deleteAccount: ${error}`);

		return res.status(400).end(); //! Bad Request
	}
}

export {
	getAccounts,
	getAccount,
	addAccount,
	setAccount,
	loginAccount,
	logoutAccount,
	deleteAccount,
};
