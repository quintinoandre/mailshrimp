import axios from 'axios';

import microservicesAuth from '../api/auth/microservicesAuth';

const { CONTACTS_API } = process.env;

interface IContact {
	id: number;
}

async function getContacts(jwt: string) {
	try {
		const config = { headers: { 'x-access-token': jwt } };

		const { status, data } = await axios.get(
			`${CONTACTS_API}/contacts`,
			config
		);

		if (status !== 200) return null;

		return data as Array<IContact>;
	} catch (error) {
		console.error(`contactService.getContacts: ${error}`);

		return null;
	}
}

async function getContact(contactId: number, accountId: number) {
	try {
		const config = {
			headers: {
				'x-access-token': await microservicesAuth.sign({
					accountId,
					contactId,
				}),
			},
		};

		const { status, data } = await axios.get(
			`${CONTACTS_API}/contacts/${contactId}/account/${accountId}`,
			config
		);

		if (status !== 200) return null;

		return data as IContact;
	} catch (error) {
		console.error(`contactService.getContact: ${error}`);

		return null;
	}
}

export { getContacts, getContact };
