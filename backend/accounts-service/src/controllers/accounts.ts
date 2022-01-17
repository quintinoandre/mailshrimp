import { Request, Response } from 'express';

import { IAccount } from '@models/account';
import {
	findAll,
	findByEmail,
	findById,
	add,
	set,
	removeById,
} from '@models/accountRepository';
import { AccountStatus } from '@models/accountStatus';
import { Token } from '@ms-commons/api/auth';
import { getToken } from '@ms-commons/api/controllers/controller';
import emailService, {
	AccountSettings,
} from '@ms-commons/clients/emailService';

import { comparePassword, hashPassword, sign } from '../auth';

async function getAccounts({ query }: Request, res: Response, _next: any) {
	const includeRemoved = query.includeRemoved === 'true';

	const accounts = await findAll(includeRemoved);

	res.json(
		accounts.map((_account) => {
			const account = _account;

			account.password = '';

			return account;
		})
	);
}

async function getAccount({ params }: Request, res: Response, _next: any) {
	try {
		const id = parseInt(params.id);

		if (!id) return res.status(400).json({ message: 'id is required!' }); //! Bad Request

		const { accountId } = getToken(res) as Token;

		if (id !== accountId) return res.sendStatus(403); //! Forbidden

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

		newAccount.id = result.id;

		newAccount.settings = await emailService.creatAccountSettings(
			newAccount.domain
		);

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

		const { accountId } = getToken(res) as Token;

		if (id !== accountId) return res.sendStatus(403); //! Forbidden

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
		const { email, password: loginPassword } = body as IAccount;

		const account = await findByEmail(email);

		if (!account) return res.sendStatus(404); //! Not Found

		const { id, password: accountPassword, status } = account;

		const isValid =
			comparePassword(loginPassword, accountPassword) &&
			status !== AccountStatus.REMOVED;

		if (isValid) {
			const token = sign(id);

			return res.json({ auth: true, token }); //* OK
		}

		return res.sendStatus(401); //! Unauthorized
	} catch (error) {
		console.error(`loginAccount: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

function logoutAccount(req: Request, res: Response, _next: any) {
	res.json({ auth: false, token: null }); //* OK
}

async function deleteAccount(
	{ params, query: { force } }: Request,
	res: Response,
	_next: any
) {
	try {
		const id = parseInt(params.id);

		if (!id) return res.status(400).json({ message: 'id is required!' }); //! Bad Request

		const { accountId } = getToken(res) as Token;

		if (id !== accountId) return res.sendStatus(403); //! Forbidden

		const account = await findById(accountId);

		if (!account) return res.sendStatus(404); //! Not Found

		await emailService.removeEmailIdentity(account.domain);

		if (force === 'true') {
			await removeById(id);

			return res.sendStatus(204); // * No content
		}

		const accountParams = { status: AccountStatus.REMOVED } as IAccount;

		const updatedAccount = await set(id, accountParams);

		if (updatedAccount) {
			updatedAccount.password = '';

			return res.status(200).json(updatedAccount); //* OK
		}

		return res.end();
	} catch (error) {
		console.error(`deleteAccount: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function getAccountSettings(_req: Request, res: Response, _next: any) {
	try {
		const { accountId } = getToken(res) as Token;

		const account = await findById(accountId);

		if (!account) return res.sendStatus(404); //! Not Found

		const { domain } = account;

		const settings = await emailService.getAccountSettings(domain);

		return res.status(200).json(settings); //* OK
	} catch (error) {
		console.error(`getAccountSettings: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function createAccountSettings(
	{ query: { force } }: Request,
	res: Response,
	_next: any
) {
	try {
		const { accountId } = getToken(res) as Token;

		const account = await findById(accountId);

		if (!account) return res.sendStatus(404); //! Not Found

		let accountSettings: AccountSettings;

		const { domain } = account;

		if (force === 'true') await emailService.removeEmailIdentity(domain);
		else {
			accountSettings = await emailService.getAccountSettings(domain);

			if (accountSettings) return res.status(200).json(accountSettings); //* OK
		}

		accountSettings = await emailService.creatAccountSettings(domain);

		return res.status(201).json(accountSettings); //* Created
	} catch (error) {
		console.error(`createAccountSettings: ${error}`);

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
	getAccountSettings,
	createAccountSettings,
};
