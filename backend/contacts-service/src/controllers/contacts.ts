import { Request, Response } from 'express';

import { add, findAll, findById } from '@models/contactRepository';
import { IContact } from '@models/contacts';
import { Token } from '@ms-commons/api/auth';
import { getToken } from '@ms-commons/api/controllers/controller';

async function getContacts(_req: Request, res: Response, _next: any) {
	try {
		const token = getToken(res) as Token;

		const contacts = await findAll(token.accountId);

		res.json(contacts); //* OK
	} catch (error) {
		console.error(`getContacts: ${error}`);

		res.status(400).end(); //! Bad Request
	}
}

async function getContact({ params }: Request, res: Response, _next: any) {
	try {
		const id = parseInt(params.id);

		if (!id) return res.status(400).end(); //! Bad Request

		const token = getToken(res) as Token;

		const contact = await findById(id, token.accountId);

		if (!contact) return res.status(404).end(); //! Not Found

		return res.json(contact); //* OK
	} catch (error) {
		console.error(`getContact: ${error}`);

		return res.status(400).end(); //! Bad Request
	}
}

async function addContact({ body }: Request, res: Response, _next: any) {
	try {
		const token = getToken(res) as Token;

		const contact = body as IContact;

		const result = await add(contact, token.accountId);

		res.status(201).json(result); //* Created
	} catch (error) {
		console.error(`addContact: ${error}`);

		res.status(400).end(); //! Bad Request
	}
}

export { getContacts, getContact, addContact };
