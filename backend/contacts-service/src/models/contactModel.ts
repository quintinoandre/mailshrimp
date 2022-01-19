import Sequelize, { Optional, Model } from 'sequelize';

import database from '@ms-commons/data/db';

import { IContact } from './contact';

type IContactCreationAttributes = Optional<IContact, 'id'>;

interface IContactModel
	extends Model<IContact, IContactCreationAttributes>,
		IContact {}

const Contact = database.define<IContactModel>(
	'contact',
	{
		id: {
			type: Sequelize.INTEGER.UNSIGNED,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		accountId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
		name: { type: Sequelize.STRING(150), allowNull: true },
		email: { type: Sequelize.STRING(150), allowNull: false },
		phone: { type: Sequelize.STRING(14), allowNull: true },
		status: {
			type: Sequelize.SMALLINT.UNSIGNED,
			allowNull: false,
			defaultValue: 100,
		},
	},
	{ indexes: [{ unique: true, fields: ['accountId', 'email'] }] }
);

export { IContactModel };

export default Contact;
