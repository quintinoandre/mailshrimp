import Sequelize, { Model, Optional } from 'sequelize';

import database from '@ms-commons/data/db';

import { IAccount } from './account';
import AccountEmail from './accountEmailModel';

type IAccountCreationAttributes = Optional<IAccount, 'id'>;
interface IAccountModel
	extends Model<IAccount, IAccountCreationAttributes>,
		IAccount {}

const Account = database.define<IAccountModel>('account', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	name: { type: Sequelize.STRING(150), allowNull: false },
	email: { type: Sequelize.STRING(150), allowNull: false, unique: true },
	password: { type: Sequelize.STRING(255), allowNull: false },
	status: {
		type: Sequelize.SMALLINT.UNSIGNED,
		allowNull: false,
		defaultValue: 100,
	},
	domain: { type: Sequelize.STRING(100), allowNull: false, unique: true },
});

Account.hasMany(AccountEmail, { constraints: true, foreignKey: 'accountId' });

export { IAccountModel };

export default Account;
