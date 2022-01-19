import baseURLs from '../configs/baseURLs';
import baseAPI from './api';

class SettingsService {
	constructor() {
		this.api = baseAPI(baseURLs.API_ACCOUNTS);
	}

	// ? get: configurações do domínio
	async get() {
		const { data } = await this.api.get('accounts/settings');

		return data;
	}

	// ? addAccountEmail: adicionar uma conta de e-mail
	async addAccountEmail(accountsEmailModel) {
		const { data } = await this.api.put(
			'accounts/settings/accountEmails',
			accountsEmailModel
		);

		return data;
	}

	// ? getOneAccountEmail: retornar uma conta de e-mail
	async getOneAccountEmail(accountsEmailId) {
		const { data } = this.api.get(
			`accounts/settings/accountEmails/${accountsEmailId}`
		);

		return { data };
	}

	// ? getAllAccountEmail: retorna todas as contas de e-mail
	async getAllAccountEmail() {
		const { data } = this.api.get('accounts/settings/accountEmails');

		return data;
	}
}

export default SettingsService;
