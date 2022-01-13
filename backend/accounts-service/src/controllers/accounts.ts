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

		if (!id) return res.status(400).json({ message: 'id is required!' }); //! Bad Request

		const token = getToken(res) as Token;

		if (id !== token.accountId) return res.sendStatus(403); //! Forbidden

		const account = await findById(id);

		if (!account) return res.sendStatus(404); //! Not Found

		account.password = '';

		return res.json(account); //* OK
	} catch (error) {
		console.error(`getAccount: ${error}`);

		return res.sendStatus(400); //! Bad Request
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

		res.sendStatus(400); //! Bad Request
	}
}

async function setAccount(
	{ body, params }: Request,
	res: Response,
	_next: any
) {
	try {
		const id = parseInt(params.id);

		if (!id) return res.status(400).json({ message: 'id is required!' }); //! Bad Request

		const token = getToken(res) as Token;

		if (id !== token.accountId) return res.sendStatus(403); //! Forbidden

		const accountParams = body as IAccount;

		const { password } = accountParams;

		if (password) accountParams.password = hashPassword(password);

		const updatedAccount = await set(id, accountParams);

		if (updatedAccount) {
			updatedAccount.password = '';

			return res.status(200).json(updatedAccount); //* OK
		}

		return res.sendStatus(404); //! Not Found
	} catch (error) {
		console.error(`setAccount: ${error}`);

		return res.sendStatus(400); //! Bad Request
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

			return res.sendStatus(401); //! Unauthorized
		}

		return res.sendStatus(404); //! Not Found
	} catch (error) {
		console.error(`loginAccount: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

function logoutAccount(req: Request, res: Response, _next: any) {
	res.json({ auth: false, token: null }); //* OK
}

async function deleteAccount({ params }: Request, res: Response, _next: any) {
	try {
		const id = parseInt(params.id);

		if (!id) return res.status(400).json({ message: 'id is required!' }); //! Bad Request

		const token = getToken(res) as Token;

		if (id !== token.accountId) return res.sendStatus(403); //! Forbidden

		await remove(id);

		return res.sendStatus(204); // * No content
	} catch (error) {
		console.error(`deleteAccount: ${error}`);

		return res.sendStatus(400); //! Bad Request
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
