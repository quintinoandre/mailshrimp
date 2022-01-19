import Sequelize, { Optional, Model } from 'sequelize';

import database from '@ms-commons/data/db';

import { IMessage } from './message';
import Sending from './sendingModel';

type IMessageCreationAttributes = Optional<IMessage, 'id'>;

interface IMessageModel
	extends Model<IMessage, IMessageCreationAttributes>,
		IMessage {}

const Message = database.define<IMessageModel>('message', {
	id: {
		type: Sequelize.INTEGER.UNSIGNED,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},
	accountId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
	accountEmailId: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
	subject: { type: Sequelize.STRING(150), allowNull: false },
	body: { type: Sequelize.TEXT, allowNull: false },
	status: {
		type: Sequelize.SMALLINT.UNSIGNED,
		allowNull: false,
		defaultValue: 100,
	},
	sendDate: { type: Sequelize.DATE, allowNull: true },
});

Message.hasMany(Sending, { constraints: true, foreignKey: 'messageId' });

Sending.belongsTo(Message, { constraints: true, foreignKey: 'messageId' });

export { IMessageModel };

export default Message;
