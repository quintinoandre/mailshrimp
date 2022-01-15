import { Request, Response } from 'express';

import { IMessage } from '@models/message';
import { add, findAll, findById, set } from '@models/messageRepository';
import { Token } from '@ms-commons/api/auth';
import { getToken } from '@ms-commons/api/controllers/controller';

async function getMessages(_req: Request, res: Response, _next: any) {
	try {
		const { accountId } = getToken(res) as Token;

		const messages = await findAll(accountId);

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

export { getMessages, getMessage, addMessage, setMessage };
