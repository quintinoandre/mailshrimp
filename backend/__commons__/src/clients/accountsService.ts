import axios from 'axios';

import microservicesAuth from '@auth/microservicesAuth';

const { ACCOUNTS_API } = process.env;

export type IAccountEmail = {
	name: string;
	email: string;
};

async function getAccountEmail(accountEmailId: number, accountId: number) {
	try {
		const config = {
			headers: {
				'x-access-token': await microservicesAuth.sign({
					accountEmailId,
					accountId,
				}),
			},
		};

		const { status, data } = await axios.get(
			`${ACCOUNTS_API}/accounts/${accountId}/accountEmails/${accountEmailId}`,
			config
		);

		if (status !== 200) return null;

		return data as IAccountEmail;
	} catch (error) {
		console.error(`accountService.getAccountEmail: ${error}`);

		return null;
	}
}

export default { getAccountEmail };
