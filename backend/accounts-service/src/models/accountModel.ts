import Sequelize, { Model, Optional } from 'sequelize';

import database from '../db';
import { IAccount } from './accounts';

type AccountCreationAttributes = Optional<IAccount, 'id'>;

interface AccountModel
	extends Model<IAccount, AccountCreationAttributes>,
		IAccount {}

const accountModel = database.define<AccountModel>('account', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	status: {
		type: Sequelize.SMALLINT.UNSIGNED,
		allowNull: false,
		defaultValue: 100,
	},
	domain: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

function findAll() {
	return accountModel.findAll<AccountModel>();
}

function findById(id: number) {
	return accountModel.findByPk<AccountModel>(id);
}

function add(account: IAccount) {
	return accountModel.create(account);
}

async function set(id: number, account: IAccount) {
	const originalAccount = await accountModel.findByPk<AccountModel>(id);

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

export { findAll, findById, add, set };
