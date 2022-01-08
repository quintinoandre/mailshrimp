import { DestroyOptions } from 'sequelize/dist';

import accountModel, { IAccountModel } from './accountModel';
import { IAccount } from './accounts';

function findAll() {
	return accountModel.findAll<IAccountModel>();
}

function findByEmail(email: string) {
	return accountModel.findOne<IAccountModel>({ where: { email } });
}

function findById(id: number) {
	return accountModel.findByPk<IAccountModel>(id);
}

function add(account: IAccount) {
	return accountModel.create(account);
}

async function set(id: number, account: IAccount) {
	const originalAccount = await accountModel.findByPk<IAccountModel>(id);

	if (originalAccount) {
		if (account.name && account.name !== originalAccount.name)
			originalAccount.name = account.name;

		if (account.password && account.password !== originalAccount.password)
			originalAccount.password = account.password;

		if (account.domain && account.domain !== originalAccount.domain)
			originalAccount.domain = account.domain;

		if (account.status && account.status !== originalAccount.status)
			originalAccount.status = account.status;

		await originalAccount.save();

		return originalAccount;
	}

	throw Error('Account not found!');
}

function remove(id: number) {
	return accountModel.destroy({ where: { id } } as DestroyOptions<IAccount>);
}

function removeByEmail(email: string) {
	return accountModel.destroy({ where: { email } } as DestroyOptions<IAccount>);
}

export { findAll, findByEmail, findById, add, set, remove, removeByEmail };
