import { IMessage } from './message';
import messageModel, { IMessageModel } from './messageModel';
import { MessageStatus } from './messageStatus';

function findAll(accountId: number, includeRemoved: boolean) {
	const { CREATED, SENT } = MessageStatus;

	if (includeRemoved)
		return messageModel.findAll<IMessageModel>({ where: { accountId } });

	return messageModel.findAll<IMessageModel>({
		where: { accountId, status: [CREATED, SENT] },
	});
}

async function findById(messageId: number, accountId: number) {
	try {
		const message = await messageModel.findOne<IMessageModel>({
			where: { id: messageId, accountId },
		});

		return message;
	} catch (error) {
		console.log(`messageRepository.findById: ${error}`);

		return null;
	}
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

	if (!originalMessage) return null;

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

function removeById(messageId: number, accountId: number) {
	return messageModel.destroy({ where: { id: messageId, accountId } });
}

export { findAll, findById, add, set, removeById };
