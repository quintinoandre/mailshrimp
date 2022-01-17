import { DestroyOptions } from 'sequelize/dist';

import { IAccount } from './account';
import AccountEmailModel from './accountEmailModel';
import accountModel, { IAccountModel } from './accountModel';
import { AccountStatus } from './accountStatus';

function findAll(includeRemoved: boolean) {
	const { ACTIVE, CREATED, SUSPENDED } = AccountStatus;

	if (includeRemoved) return accountModel.findAll<IAccountModel>();

	return accountModel.findAll<IAccountModel>({
		where: { status: [ACTIVE, CREATED, SUSPENDED] },
	});
}

function findByEmail(email: string) {
	return accountModel.findOne<IAccountModel>({ where: { email } });
}

function findById(id: number) {
	return accountModel.findByPk<IAccountModel>(id);
}

function findByIdWithEmails(id: number) {
	return accountModel.findByPk<IAccountModel>(id, {
		include: AccountEmailModel,
	});
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

		if (newAccount.status && newAccount.status !== originalAccount.status)
			originalAccount.status = newAccount.status;

		const result = await originalAccount.save();

		newAccount.id = result.id;

		return newAccount;
	}

	return null;
}

function removeById(id: number) {
	return accountModel.destroy({ where: { id } } as DestroyOptions<IAccount>);
}

function removeByEmail(email: string) {
	return accountModel.destroy({ where: { email } } as DestroyOptions<IAccount>);
}

export default {
	findAll,
	findByEmail,
	findById,
	findByIdWithEmails,
	add,
	set,
	removeById,
	removeByEmail,
};
