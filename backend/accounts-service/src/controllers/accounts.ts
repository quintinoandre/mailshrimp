import { Request, Response } from 'express';

import { IAccount } from '@models/account';
import { IAccountEmail } from '@models/accountEmail';
import accountEmailRepository from '@models/accountEmailRepository';
import accountRepository from '@models/accountRepository';
import { AccountStatus } from '@models/accountStatus';
import { Token } from '@ms-commons/api/auth/accountsAuth';
import { getToken } from '@ms-commons/api/controllers/controller';
import emailService, {
	AccountSettings,
} from '@ms-commons/clients/emailService';

import { comparePassword, hashPassword, sign } from '../auth';

async function getAccounts({ query }: Request, res: Response, _next: any) {
	const includeRemoved = query.includeRemoved === 'true';

	const accounts = await accountRepository.findAll(includeRemoved);

	res.json(
		accounts.map((_account) => {
			const account = _account;

			account.password = '';

			return account;
		})
	);
}

async function getAccount(
	{ params: { id } }: Request,
	res: Response,
	_next: any
) {
	try {
		const accountId = parseInt(id);

		if (!accountId)
			return res.status(400).json({ message: 'accountId is required!' }); //! Bad Request

		const token = getToken(res) as Token;

		if (accountId !== token.accountId) return res.sendStatus(403); //! Forbidden

		const account = await accountRepository.findById(accountId);

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

		const { id } = await accountRepository.add(newAccount);

		newAccount.password = '';

		newAccount.id = id;

		newAccount.settings = await emailService.creatAccountSettings(
			newAccount.domain
		);

		res.status(201).json(newAccount); //* Created
	} catch (error) {
		console.error(`addAccount: ${error}`);

		res.sendStatus(400); //! Bad Request
	}
}

async function deleteAccount(
	{ params: { id }, query: { force } }: Request,
	res: Response,
	_next: any
) {
	try {
		const accountId = parseInt(id);

		if (!accountId)
			return res.status(400).json({ message: 'accountId is required!' }); //! Bad Request

		const token = getToken(res) as Token;

		if (accountId !== token.accountId) return res.sendStatus(403); //! Forbidden

		const account = await accountRepository.findByIdWithEmails(accountId);

		if (!account) return res.sendStatus(404); //! Not Found

		const accountEmails = account.get('accountEmails', {
			plain: true,
		}) as IAccountEmail[];

		if (accountEmails && accountEmails.length > 0) {
			const promises = accountEmails.map((accountEmail) => {
				return emailService.removeEmailIdentity(accountEmail.email);
			});

			await Promise.all(promises);

			await accountEmailRepository.removeAll(accountId);
		}

		await emailService.removeEmailIdentity(account.domain);

		if (force === 'true') {
			await accountRepository.removeById(accountId);

			return res.sendStatus(204); // * No content
		}

		const accountParams = { status: AccountStatus.REMOVED } as IAccount;

		const updatedAccount = await accountRepository.set(
			accountId,
			accountParams
		);

		if (updatedAccount) {
			updatedAccount.password = '';

			return res.status(200).json(updatedAccount); //* OK
		}

		return res.sendStatus(404); //! Not Found
	} catch (error) {
		console.error(`deleteAccount: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function setAccount(req: Request, res: Response, next: any) {
	try {
		const accountParams = req.body as IAccount;

		if (accountParams.status === AccountStatus.REMOVED)
			return deleteAccount(req, res, next);

		const id = parseInt(req.params.id);

		if (!id) return res.status(400).json({ message: 'accountId is required!' }); //! Bad Request

		const { accountId } = getToken(res) as Token;

		if (id !== accountId) return res.sendStatus(403); //! Forbidden

		const { password } = accountParams;

		if (password) accountParams.password = hashPassword(password);

		const updatedAccount = await accountRepository.set(id, accountParams);

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

		const account = await accountRepository.findByEmail(email);

		if (!account) return res.sendStatus(404); //! Not Found

		const { id, password: accountPassword, status } = account;

		const isValid =
			comparePassword(loginPassword, accountPassword) &&
			status !== AccountStatus.REMOVED;

		if (isValid) {
			const token = sign(id);

			return res.status(200).json({ auth: true, token }); //* OK
		}

		return res.sendStatus(401); //! Unauthorized
	} catch (error) {
		console.error(`loginAccount: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

function logoutAccount(req: Request, res: Response, _next: any) {
	res.status(200).json({ auth: false, token: null }); //* OK
}

async function getAccountSettings(_req: Request, res: Response, _next: any) {
	try {
		const { accountId } = getToken(res) as Token;

		const account = await accountRepository.findByIdWithEmails(accountId);

		if (!account) return res.sendStatus(404); //! Not Found

		let emails: string[] = [];

		const accountEmails = account.get('accountEmails', {
			plain: true,
		}) as IAccountEmail[];

		if (accountEmails && accountEmails.length > 0)
			emails = accountEmails.map((accountEmail) => accountEmail.email);

		const { domain } = account;

		const settings = await emailService.getAccountSettings(domain, emails);

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

		const account = await accountRepository.findById(accountId);

		if (!account) return res.sendStatus(404); //! Not Found

		let accountSettings: AccountSettings;

		const { domain } = account;

		if (force === 'true') await emailService.removeEmailIdentity(domain);
		else {
			accountSettings = await emailService.getAccountSettings(domain, []);

			if (accountSettings) return res.status(200).json(accountSettings); //* OK
		}

		accountSettings = await emailService.creatAccountSettings(domain);

		return res.status(201).json(accountSettings); //* Created
	} catch (error) {
		console.error(`createAccountSettings: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function addAccountEmail({ body }: Request, res: Response, _next: any) {
	const accountEmail = body as IAccountEmail;

	const { accountId } = getToken(res) as Token;

	try {
		const account = await accountRepository.findByIdWithEmails(accountId);

		if (!account) return res.sendStatus(404); //! Not Found

		const { domain } = account;

		if (!accountEmail.email.endsWith(`@${domain}`)) return res.sendStatus(403); //! Forbidden

		const accountEmails = account.get('accountEmails', {
			plain: true,
		}) as IAccountEmail[];

		let alreadyExists = false;

		if (accountEmails && accountEmails.length > 0)
			alreadyExists = accountEmails.some(
				(item) => item.email === accountEmail.email
			);

		if (alreadyExists)
			return res.status(400).json({ message: 'accountEmail already exists!' }); //! Bad Request

		accountEmail.accountId = accountId;

		const { id } = await accountEmailRepository.add(accountEmail);

		if (!id)
			return res
				.status(400)
				.json({ message: `Couldn't save the accountEmail!` }); //! Bad Request

		accountEmail.id = id;

		await emailService.addEmailIdentity(accountEmail.email);

		return res.status(201).json(accountEmail); //* Created
	} catch (error) {
		console.error(`addAccountEmail: ${error}`);

		if (accountEmail.id)
			await accountEmailRepository.remove(accountEmail.id, accountId);

		return res.sendStatus(400); //! Bad Request
	}
}

async function getAccountEmails(_req: Request, res: Response, _next: any) {
	try {
		const { accountId } = getToken(res) as Token;

		const account = await accountRepository.findByIdWithEmails(accountId);

		if (!account) return res.sendStatus(404); //! Not Found

		let emails: string[] = [];

		const accountEmails = account.get('accountEmails', {
			plain: true,
		}) as IAccountEmail[];

		if (accountEmails && accountEmails.length > 0)
			emails = accountEmails.map((accountEmail) => accountEmail.email);

		const settings = await emailService.getEmailSettings(emails);

		accountEmails.forEach((item) => {
			// eslint-disable-next-line no-param-reassign
			item.settings = settings.find((s) => s.email === item.email);
		});

		return res.status(200).json(accountEmails); //* OK
	} catch (error) {
		console.error(`getAccountsEmails: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function getAccountEmail({ params }: Request, res: Response, _next: any) {
	try {
		let accountId = parseInt(params.accountId);

		if (!accountId) {
			const token = getToken(res) as Token;

			accountId = token.accountId;
		}

		const accountEmailId = parseInt(params.accountEmailId);

		if (!accountId || !accountEmailId)
			return res
				.status(400)
				.json({ message: 'Both accountId and accountEmailId  are required!' }); //! Bad Request

		const accountEmail = (await accountEmailRepository.findById(
			accountEmailId,
			accountId,
			true
		)) as IAccountEmail;

		if (!accountEmail) return res.sendStatus(404); //! Not Found

		const settings = await emailService.getEmailSettings([accountEmail.email]);

		if (!settings || settings.length < 1)
			return res.status(404).json({ message: 'Settings not found!' }); //! Not Found

		// eslint-disable-next-line prefer-destructuring
		accountEmail.settings = settings[0];

		return res.status(200).json(accountEmail); //* OK
	} catch (error) {
		console.error(`getAccountEmail: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function setAccountEmail(
	{ body, params: { id } }: Request,
	res: Response,
	_next: any
) {
	try {
		const accountEmailId = parseInt(id);

		if (!accountEmailId)
			return res.status(400).json({ message: 'accountEmailId is required!' }); //! Bad Request

		const token = getToken(res) as Token;

		const accountEmailParams = body as IAccountEmail;

		const updatedAccountEmail = await accountEmailRepository.set(
			accountEmailId,
			token.accountId,
			accountEmailParams
		);

		if (updatedAccountEmail) return res.status(200).json(updatedAccountEmail); //* OK

		return res.sendStatus(404); //! Not Found
	} catch (error) {
		console.error(`setAccountEmail: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function deleteAccountEmail(
	{ params: { id } }: Request,
	res: Response,
	_next: any
) {
	try {
		const accountEmailId = parseInt(id);

		if (!accountEmailId)
			return res.status(400).json({ message: 'accountEmailId is required!' }); //! Bad Request

		const token = getToken(res) as Token;

		const accountEmail = await accountEmailRepository.findById(
			accountEmailId,
			token.accountId,
			true
		);

		if (!accountEmail) return res.sendStatus(404); //! Not Found

		await emailService.removeEmailIdentity(accountEmail.email);

		await accountEmailRepository.remove(accountEmailId, token.accountId);

		return res.sendStatus(204); // * No content
	} catch (error) {
		console.error(`deleteAccountEmail: ${error}`);

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
	addAccountEmail,
	getAccountEmails,
	getAccountEmail,
	setAccountEmail,
	deleteAccountEmail,
};
