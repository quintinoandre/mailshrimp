import { IMessage } from './message';
import messageModel, { IMessageModel } from './messageModel';

function findAll(accountId: number) {
	return messageModel.findAll<IMessageModel>({ where: { accountId } });
}

function findById(messageId: number, accountId: number) {
	return messageModel.findOne<IMessageModel>({
		where: { id: messageId, accountId },
	});
}

async function add(message: IMessage, accountId: number) {
	const newMessage = message;

	newMessage.accountId = accountId;

	const { id } = await messageModel.create(newMessage);

	newMessage.id = id;

	return newMessage;
}

async function set(messageId: number, message: IMessage, accountId: number) {
	const newMessage = message;

	const originalMessage = await messageModel.findOne({
		where: { id: messageId, accountId },
	});

	if (originalMessage) {
		if (newMessage.subject && newMessage.subject !== originalMessage.subject)
			originalMessage.subject = newMessage.subject;

		if (newMessage.body && newMessage.body !== originalMessage.body)
			originalMessage.body = newMessage.body;

		if (newMessage.status && newMessage.status !== originalMessage.status)
			originalMessage.status = newMessage.status;

		if (newMessage.sendDate && newMessage.sendDate !== originalMessage.sendDate)
			originalMessage.sendDate = newMessage.sendDate;

		const { id } = await originalMessage.save();

		newMessage.id = id;

		return newMessage;
	}

	return null;
}

function removeById(messageId: number, accountId: number) {
	return messageModel.destroy({ where: { id: messageId, accountId } });
}

export { findAll, findById, add, set, removeById };
