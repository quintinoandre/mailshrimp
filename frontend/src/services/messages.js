import baseURLs from '../configs/baseURLs';
import baseAPI from './api';

class MessageService {
	constructor() {
		this.api = baseAPI(baseURLs.API_MESSAGES);
	}

	async getAll() {
		const { data } = await this.api.get('messages');

		return data;
	}

	async getOne(messageId) {
		const { data } = await this.api.get(`messages/${messageId}`);

		return data;
	}

	async add(messageModel) {
		const result = await this.api.post('messages', messageModel);

		return result;
	}

	async delete(messageId) {
		const result = await this.api.delete(`messages/${messageId}`);

		return result;
	}

	async send(messageId) {
		const result = await this.api.post(`messages/${messageId}/send`);

		return result;
	}
}

export default MessageService;
