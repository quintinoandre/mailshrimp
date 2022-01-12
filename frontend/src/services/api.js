import axios from 'axios';

import { getToken } from './auth';

const baseApi = (baseURL) => {
	const api = axios.create({ baseURL });

	api.interceptors.request.use(async (config) => {
		const token = getToken();

		if (token) config.headers['x-access-token'] = token;

		return config;
	});

	return api;
};

export default baseApi;
