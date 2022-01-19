import { Request, Response } from 'express';

import { IMessage } from '@models/message';
import messageRepository from '@models/messageRepository';
import { MessageStatus } from '@models/messageStatus';
import { ISending } from '@models/sending';
import sendingRepository from '@models/sendingRepository';
import { SendingStatus } from '@models/sendingStatus';
import { Token } from '@ms-commons/api/auth/accountsAuth';
import { getToken } from '@ms-commons/api/controllers/controller';
import accountsService from '@ms-commons/clients/accountsService';
import contactsService from '@ms-commons/clients/contactsService';
import emailService from '@ms-commons/clients/emailService';
import queueService from '@ms-commons/clients/queueService';

async function getMessages({ query }: Request, res: Response, _next: any) {
	try {
		const includeRemoved = query.includeRemoved === 'true';

		const { accountId } = getToken(res) as Token;

		const messages = await messageRepository.findAll(accountId, includeRemoved);

		res.status(200).json(messages); //* OK
	} catch (error) {
		console.error(`getMessages: ${error}`);

		res.sendStatus(400); //! Bad Request
	}
}

async function getMessage(
	{ params: { id } }: Request,
	res: Response,
	_next: any
) {
	try {
		const messageId = parseInt(id);

		if (!messageId)
			return res.status(400).json({ message: 'messageId is required!' }); //! Bad Request

		const token = getToken(res) as Token;

		const message = await messageRepository.findById(
			messageId,
			token.accountId
		);

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

		const result = await messageRepository.add(message, accountId);

		res.status(201).json(result); //* Created
	} catch (error) {
		console.error(`addMessage: ${error}`);

		res.sendStatus(400); //! Bad Request
	}
}

async function setMessage(
	{ body, params: { id } }: Request,
	res: Response,
	_next: any
) {
	try {
		const messageId = parseInt(id);

		if (!messageId)
			return res.status(400).json({ message: 'messageId is required!' }); //! Bad Request

		const token = getToken(res) as Token;

		const message = body as IMessage;

		const result = await messageRepository.set(
			messageId,
			message,
			token.accountId
		);

		if (!result) return res.sendStatus(404); //! Not Found

		return res.status(200).json(result); //* OK
	} catch (error) {
		console.error(`setMessage: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function deleteMessage(
	{ params: { id }, query: { force } }: Request,
	res: Response,
	_next: any
) {
	try {
		const messageId = parseInt(id);

		if (!messageId)
			return res.status(400).json({ message: 'messageId is required!' }); //! Bad Request

		const token = getToken(res) as Token;

		if (force === 'true') {
			await messageRepository.removeById(messageId, token.accountId);

			return res.sendStatus(204); // * No content
		}

		const messageParams = { status: MessageStatus.REMOVED } as IMessage;

		const updatedContact = await messageRepository.set(
			messageId,
			messageParams,
			token.accountId
		);

		if (updatedContact) return res.status(200).json(updatedContact); //* OK

		return res.sendStatus(403); //! Forbidden
	} catch (error) {
		console.error(`deleteMessage: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function scheduleMessage(
	{ params: { id } }: Request,
	res: Response,
	_next: any
) {
	try {
		// ? obter a mensagem
		const messageId = parseInt(id);

		if (!messageId)
			return res.status(400).json({ message: 'messageId is required!' }); //! Bad Request

		const token = getToken(res) as Token;

		const message = await messageRepository.findById(
			messageId,
			token.accountId
		);

		if (!message) return res.sendStatus(403); //! Forbidden

		// ? obter os contactos
		const contacts = await contactsService.getContacts(token.jwt);

		if (!contacts || contacts.length < 1)
			return res
				.status(404)
				.json({ message: 'There are no contacts for this account!' }); //! Bad Request

		// ? criar as sendings
		const sendings = await sendingRepository.addAll(
			contacts.map((contact) => {
				return {
					accountId: token.accountId,
					contactId: contact.id,
					messageId,
					status: SendingStatus.QUEUED,
				};
			})
		);

		if (!sendings)
			return res.status(400).json({ message: "Couldn't save the sendings!" });

		// ? simplificar os sendings para fila
		const messages = sendings.map((item) => {
			return {
				id: item.id,
				accountId: item.accountId,
				contactId: item.contactId,
				messageId: item.messageId,
			};
		});

		// ? enviar as mensagens para a fila
		const promises = queueService.sendMessageBatch(messages);

		await Promise.all(promises);

		// ? atualizar a mensagem
		const messageParams = {
			status: MessageStatus.SCHEDULE,
			sendDate: new Date(),
		} as IMessage;

		const updatedMessage = await messageRepository.set(
			messageId,
			messageParams,
			token.accountId
		);

		if (updatedMessage) return res.status(202).json(updatedMessage); //* Accepted

		return res.sendStatus(403); //! Forbidden
	} catch (error) {
		console.error(`sendMessage: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function sendMessage(
	{ body, params: { id, messageId, accountId, contactId } }: Request,
	res: Response,
	_next: any
) {
	try {
		const params = body as ISending;

		// ? obter o envio
		const sending = await sendingRepository.findQueuedOne(
			id,
			parseInt(messageId),
			parseInt(accountId),
			parseInt(contactId)
		);

		if (!sending)
			return res.status(404).json({ message: 'Sending not found!' }); //! Not Found

		// TODO: implemetar cache no futuro
		// ? obter a mensagem
		const message = await messageRepository.findById(
			sending.messageId,
			sending.accountId
		);

		if (!message)
			return res.status(404).json({ message: 'Message not found!' }); //! Not Found

		// ? obter o contacto (destinatário)
		const contact = await contactsService.getContact(
			sending.contactId,
			sending.accountId
		);

		if (!contact)
			return res.status(404).json({ message: 'Contact not found!' }); //! Not Found

		// ? obter o accountEmail (remetente)
		const accountEmail = await accountsService.getAccountEmail(
			sending.accountId,
			message.accountEmailId
		);

		if (!accountEmail)
			return res.status(404).json({ message: 'accountEmail not found!' }); //! Not Found

		// ? enviar o e-mail (SES)
		const result = await emailService.sendEmail(
			accountEmail.name,
			accountEmail.email,
			contact.email,
			message.subject,
			message.body
		);

		if (!result.success)
			return res
				.status(400)
				.json({ message: `Couldn't send the email message` }); //! Bad Request

		sending.status = SendingStatus.SENT;

		sending.sendDate = new Date();

		await sendingRepository.set(params.id, sending, sending.accountId);

		// ? atualizar a message
		const hasMore = await sendingRepository.hasQueuedSendings(
			sending.messageId,
			sending.accountId
		);

		if (!hasMore) {
			message.status = MessageStatus.SENT;

			message.sendDate = new Date();

			await messageRepository.set(
				sending.messageId,
				message,
				sending.accountId
			);
		}

		return res.status(202).json(sending); //* Accepted
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
	scheduleMessage,
	sendMessage,
};
