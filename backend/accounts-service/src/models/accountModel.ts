import Sequelize, { Model, Optional } from 'sequelize';

import database from '../db';
import { IAccount } from './accounts';

type AccountCreationAttributes = Optional<IAccount, 'id'>;

interface AccountModel
	extends Model<IAccount, AccountCreationAttributes>,
		IAccount {}

export default database.define<AccountModel>('account', {
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

export { AccountModel };
