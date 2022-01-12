import baseURLs from '../configs/baseURLs';
import baseApi from './api';

class AccountsService {
	constructor() {
		this.api = baseApi(baseURLs.API_ACCOUNTS);
	}

	async signup(userModel) {
		const result = await this.api.post('accounts', userModel);

		return result;
	}

	async login(email, password) {
		const result = await this.api.post('accounts/login', { email, password });

		return result;
	}
}

export default AccountsService;
