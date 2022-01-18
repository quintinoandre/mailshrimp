import { v4 as uuid } from 'uuid';

import { ISending } from './sending';
import sendingModel, { ISendingModel } from './sendingModel';
import { SendingStatus } from './sendingStatus';

async function findQueuedOne(
	id: string,
	accountId: number,
	contactId: number,
	messageId: number
) {
	try {
		const sending = await sendingModel.findOne<ISendingModel>({
			where: {
				id,
				accountId,
				contactId,
				messageId,
				status: SendingStatus.QUEUED,
			},
		});

		return sending;
	} catch (error) {
		console.log(`findQueuedOne: ${error}`);

		return null;
	}
}

async function findByMessageId(messageId: number, accountId: number) {
	try {
		const sendings = await sendingModel.findAll<ISendingModel>({
			where: { messageId, accountId },
		});

		return sendings;
	} catch (error) {
		console.log(`findByMessageId: ${error}`);

		return null;
	}
}

async function findByContactId(contactId: number, accountId: number) {
	try {
		const sendings = await sendingModel.findAll<ISendingModel>({
			where: { contactId, accountId },
		});

		return sendings;
	} catch (error) {
		console.log(`findByContactId: ${error}`);

		return null;
	}
}

async function add(_sending: ISending) {
	const sending = _sending;

	sending.id = uuid();

	const result = await sendingModel.create(sending);

	return result;
}

async function addAll(sendings: ISending[]) {
	if (!sendings && sendings.length < 1) return null;

	sendings.forEach((item) => (item.id = uuid()));

	const result = await sendingModel.bulkCreate(sendings);

	return result;
}

async function set(sendingId: string, sending: ISending, accountId: number) {
	const originalSending = await sendingModel.findOne({
		where: { id: sendingId, accountId },
	});

	if (!originalSending) return null;

	if (sending.status && sending.status !== originalSending.status)
		originalSending.status = sending.status;

	if (sending.sendDate && sending.sendDate !== originalSending.sendDate)
		originalSending.sendDate = sending.sendDate;

	const result = await originalSending.save();

	return result;
}

async function removeById(sendingId: string, accountId: number) {
	await sendingModel.destroy({ where: { id: sendingId, accountId } });
}

async function hasQueuedSendings(messageId: number, accountId: number) {
	return (
		(await sendingModel.count({
			where: { messageId, accountId, status: SendingStatus.QUEUED },
		})) > 0
	);
}

export default {
	findQueuedOne,
	findByMessageId,
	findByContactId,
	add,
	addAll,
	set,
	removeById,
	hasQueuedSendings,
};
