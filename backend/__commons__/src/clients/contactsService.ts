import axios from 'axios';

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

export { getContacts };
