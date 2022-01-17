import Sequelize, { Model, Optional } from 'sequelize';

import database from '@ms-commons/data/db';

import { IAccountEmail } from './accountEmail';

type IAccountEmailCreationAttributes = Optional<IAccountEmail, 'id'>;

interface IAccountEmailModel
	extends Model<IAccountEmail, IAccountEmailCreationAttributes>,
		IAccountEmail {}

const AccountEmail = database.define<IAccountEmailModel>('accountEmail', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	accountId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
	name: { type: Sequelize.STRING(150), allowNull: false },
	email: { type: Sequelize.STRING(150), allowNull: false, unique: true },
});

export { IAccountEmailModel };

export default AccountEmail;
