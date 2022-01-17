import { STATUS_CODES } from 'http';
import request from 'supertest';

import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

import emailService from '../../__commons__/src/clients/emailService';
import app from '../src/app';
import { sign } from '../src/auth';
import { IAccount } from '../src/models/account';
import { IAccountEmail } from '../src/models/accountEmail';
import accountEmailRepository from '../src/models/accountEmailRepository';
import accountRepository from '../src/models/accountRepository';

let jwt: string;
let testAccountId: number;
const TEST_EMAIL = 'jest@settings.com';
const TEST_DOMAIN = 'settings.com';
const HASH_PASSWORD =
	'$2a$10$Ive59EREl/VkatAZYl9qF.MI5u3Db4vV/bK/pkHXgxHNUrl.CEFMu';

afterAll(async () => {
	// jest.setTimeout(10000);

	await emailService.removeEmailIdentity(TEST_DOMAIN);

	await accountRepository.removeByEmail(TEST_EMAIL);
});

describe('Testing routes of accounts/settings', () => {
	beforeAll(async () => {
		// jest.setTimeout(10000);

		const testAccount: IAccount = {
			name: 'jest',
			email: TEST_EMAIL,
			domain: TEST_DOMAIN,
			password: HASH_PASSWORD,
		};

		const result = await accountRepository.add(testAccount);

		testAccountId = result.id;

		jwt = sign(testAccountId);

		await emailService.creatAccountSettings(TEST_DOMAIN);
	});

	it(`GET /accounts/settings - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const { status, body } = await request(app)
			.get('/accounts/settings')
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(Array.isArray(body)).toBeTruthy();
	});
});
