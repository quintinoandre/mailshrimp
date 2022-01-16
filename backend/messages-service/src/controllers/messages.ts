import { Request, Response } from 'express';

import { IMessage } from '@models/message';
import {
	add,
	findAll,
	findById,
	set,
	removeById,
} from '@models/messageRepository';
import { MessageStatus } from '@models/messageStatus';
import { IQueueMessage } from '@models/queueMessage';
import { Token } from '@ms-commons/api/auth';
import { getToken } from '@ms-commons/api/controllers/controller';
import { getContacts } from '@ms-commons/clients/contactsService';

import queueService from '../queueService';

async function getMessages({ query }: Request, res: Response, _next: any) {
	try {
		const includeRemoved = query.includeRemoved === 'true';

		const { accountId } = getToken(res) as Token;

		const messages = await findAll(accountId, includeRemoved);

		res.status(200).json(messages); //* OK
	} catch (error) {
		console.error(`getMessages: ${error}`);

		res.sendStatus(400); //! Bad Request
	}
}

async function getMessage({ params }: Request, res: Response, _next: any) {
	try {
		const id = parseInt(params.id);

		if (!id) return res.status(400).json({ message: 'id is required!' }); //! Bad Request

		const { accountId } = getToken(res) as Token;

		const message = await findById(id, accountId);

		if (!message) return res.sendStatus(404); //! Not Found

		return res.status(200).json(message); //* OK
	} catch (error) {
		console.error(`getMessage: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function addMessage({ body }: Request, res: Response, _next: any) {
	try {
		const { accountId } = getToken(res) as Token;

		const message = body as IMessage;

		const result = await add(message, accountId);

		res.status(201).json(result); //* Created
	} catch (error) {
		console.error(`addMessage: ${error}`);

		res.sendStatus(400); //! Bad Request
	}
}

async function setMessage(
	{ body, params }: Request,
	res: Response,
	_next: any
) {
	try {
		const id = parseInt(params.id);

		if (!id) return res.status(400).json({ message: 'id is required!' }); //! Bad Request

		const { accountId } = getToken(res) as Token;

		const message = body as IMessage;

		const result = await set(id, message, accountId);

		if (!result) return res.sendStatus(404); //! Not Found

		return res.json(result); //* OK
	} catch (error) {
		console.error(`setMessage: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function deleteMessage(
	{ params, query: { force } }: Request,
	res: Response,
	_next: any
) {
	try {
		const id = parseInt(params.id);

		if (!id) return res.status(400).json({ message: 'id is required!' }); //! Bad Request

		const { accountId } = getToken(res) as Token;

		if (force === 'true') {
			await removeById(id, accountId);

			return res.sendStatus(204); // * No content
		}

		const messageParams = { status: MessageStatus.REMOVED } as IMessage;

		const updatedContact = await set(id, messageParams, accountId);

		if (updatedContact) return res.status(200).json(updatedContact); //* OK

		return res.sendStatus(403); //! Forbidden
	} catch (error) {
		console.error(`deleteMessage: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function sendMessage({ params }: Request, res: Response, _next: any) {
	try {
		// ? obter a mensagem
		const id = parseInt(params.id);

		if (!id) return res.status(400).json({ message: 'id is required!' }); //! Bad Request

		const { accountId, jwt } = getToken(res) as Token;

		const message = await findById(id, accountId);

		if (!message) return res.sendStatus(403); //! Forbidden

		// ? obter os contactos
		const contacts = await getContacts(jwt);

		if (!contacts || contacts.length < 1) return res.sendStatus(400); //! Bad Request

		// ? enviar as mensagens para a fila
		const promises = contacts.map((contact) => {
			return queueService.sendMessage({
				accountId,
				contactId: contact.id,
				messageId: id,
			} as IQueueMessage);
		});

		await Promise.all(promises);

		// ? atualizar a mensagem
		const messageParams = {
			status: MessageStatus.SENT,
			sendDate: new Date(),
		} as IMessage;

		const updatedMessage = await set(id, messageParams, accountId);

		if (updatedMessage) return res.status(200).json(updatedMessage); //* OK

		return res.sendStatus(403); //! Forbidden
	} catch (error) {
		console.error(`sendMessage: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

export {
	getMessages,
	getMessage,
	addMessage,
	setMessage,
	deleteMessage,
	sendMessage,
};
