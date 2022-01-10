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
	const newAccount = account;

	const originalAccount = await accountModel.findByPk<IAccountModel>(id);

	if (originalAccount) {
		if (newAccount.name && newAccount.name !== originalAccount.name)
			originalAccount.name = newAccount.name;

		if (newAccount.password && newAccount.password !== originalAccount.password)
			originalAccount.password = newAccount.password;

		if (newAccount.domain && newAccount.domain !== originalAccount.domain)
			originalAccount.domain = newAccount.domain;

		if (newAccount.status && newAccount.status !== originalAccount.status)
			originalAccount.status = newAccount.status;

		const result = await originalAccount.save();

		newAccount.id = result.id;

		return newAccount;
	}

	return null;
}

function remove(id: number) {
	return accountModel.destroy({ where: { id } } as DestroyOptions<IAccount>);
}

function removeByEmail(email: string) {
	return accountModel.destroy({ where: { email } } as DestroyOptions<IAccount>);
}

export { findAll, findByEmail, findById, add, set, remove, removeByEmail };
