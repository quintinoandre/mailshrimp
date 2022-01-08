import { STATUS_CODES } from 'http';
import request from 'supertest';

import app from '../src/app';
import { add, removeByEmail } from '../src/models/accountRepository';
import { IAccount } from '../src/models/accounts';

const TEST_EMAIL = 'jest@jest.com';
const HASH_TEST_PASSWORD =
	'$2a$10$Ive59EREl/VkatAZYl9qF.MI5u3Db4vV/bK/pkHXgxHNUrl.CEFMu';
const TEST_PASSWORD = '123456';

beforeAll(async () => {
	const testAccount: IAccount = {
		name: 'jest',
		email: TEST_EMAIL,
		password: HASH_TEST_PASSWORD,
		domain: 'jest.com',
	};

	await add(testAccount);
});

afterAll(async () => {
	await removeByEmail(TEST_EMAIL);
});

describe('Testing routes of authentication', () => {
	it(`POST /accounts/login - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const payload = {
			email: TEST_EMAIL,
			password: TEST_PASSWORD,
		};

		const result = await request(app).post('/accounts/login').send(payload);

		expect(result.status).toEqual(200);
		expect(result.body.auth).toBeTruthy();
		expect(result.body.token).toBeTruthy();
	});

	it(`POST /accounts/login - should return statusCode 422 (${STATUS_CODES[422]})`, async () => {
		const payload = { email: TEST_EMAIL };

		const result = await request(app).post('/accounts/login').send(payload);

		expect(result.status).toEqual(422);
	});

	it(`POST /accounts/login - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const payload = {
			email: TEST_EMAIL,
			password: `${TEST_PASSWORD}1`,
		};

		const result = await request(app).post('/accounts/login').send(payload);

		expect(result.status).toEqual(401);
	});

	it(`POST /accounts/logout - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const result = await request(app).post('/accounts/logout');

		expect(result.status).toEqual(200);
	});
});
