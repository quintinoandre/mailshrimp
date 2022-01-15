import baseURLs from '../configs/baseURLs';
import baseApi from './api';

class ContactsService {
	constructor() {
		this.api = baseApi(baseURLs.API_CONTACTS);
	}

	async getAll() {
		const { data } = await this.api.get('contacts');

		return data;
	}

	async getOne(contactId) {
		const { data } = await this.api.get(`contacts/${contactId}`);

		return data;
	}

	async add(contactModel) {
		const result = await this.api.post('contacts', contactModel);

		return result;
	}

	async delete(contactId) {
		const result = await this.api.delete(`contacts/${contactId}`);

		return result;
	}
}

export default ContactsService;
