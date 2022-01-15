import { Request, Response } from 'express';

import { IContact } from '@models/contact';
import {
	add,
	findAll,
	findById,
	removeById,
	set,
} from '@models/contactRepository';
import { ContactStatus } from '@models/contactStatus';
import { Token } from '@ms-commons/api/auth';
import { getToken } from '@ms-commons/api/controllers/controller';

async function getContacts({ query }: Request, res: Response, _next: any) {
	try {
		const includeRemoved = query.includeRemoved === 'true';

		const { accountId } = getToken(res) as Token;

		const contacts = await findAll(accountId, includeRemoved);

		res.status(200).json(contacts); //* OK
	} catch (error) {
		console.error(`getContacts: ${error}`);

		res.sendStatus(400); //! Bad Request
	}
}

async function getContact({ params }: Request, res: Response, _next: any) {
	try {
		const id = parseInt(params.id);

		if (!id) return res.status(400).json({ message: 'id is required!' }); //! Bad Request

		const { accountId } = getToken(res) as Token;

		const contact = await findById(id, accountId);

		if (!contact) return res.sendStatus(404); //! Not Found

		return res.json(contact); //* OK
	} catch (error) {
		console.error(`getContact: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function addContact({ body }: Request, res: Response, _next: any) {
	try {
		const { accountId } = getToken(res) as Token;

		const contact = body as IContact;

		const result = await add(contact, accountId);

		res.status(201).json(result); //* Created
	} catch (error) {
		console.error(`addContact: ${error}`);

		res.sendStatus(400); //! Bad Request
	}
}

async function setContact(
	{ body, params }: Request,
	res: Response,
	_next: any
) {
	try {
		const id = parseInt(params.id);

		if (!id) return res.status(400).json({ message: 'id is required!' }); //! Bad Request

		const { accountId } = getToken(res) as Token;

		const contact = body as IContact;

		const result = await set(id, contact, accountId);

		if (!result) return res.sendStatus(404); //! Not Found

		return res.json(result); //* OK
	} catch (error) {
		console.error(`setContact: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

async function deleteContact(
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

		const contactParams = { status: ContactStatus.REMOVED } as IContact;

		const updatedContact = await set(id, contactParams, accountId);

		if (updatedContact) return res.status(200).json(updatedContact); //* OK

		return res.sendStatus(403); //! Forbidden
	} catch (error) {
		console.error(`deleteContact: ${error}`);

		return res.sendStatus(400); //! Bad Request
	}
}

export { getContacts, getContact, addContact, setContact, deleteContact };
