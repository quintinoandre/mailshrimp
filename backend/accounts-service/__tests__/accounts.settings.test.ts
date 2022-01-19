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

let jwt = '' as string;
let jwt2 = '' as string;
let testAccountId = 0 as number;
let testAccountId2 = 0 as number;
let testAccountEmailId = 0 as number;
let testAccountEmailId2 = 0 as number;
const TEST_EMAIL = 'jest@settings.com' as string;
const TEST_EMAIL2 = 'jest@settings2.com' as string;
const TEST_EMAIL3 = 'jest2@settings2.com' as string;
const TEST_EMAIL4 = 'jest3@settings2.com' as string;
const TEST_EMAIL5 = 'jest4@settings2.com' as string;
const TEST_DOMAIN = 'settings.com' as string;
const TEST_DOMAIN2 = 'settings2.com' as string;
const HASH_PASSWORD =
	'$2a$10$Ive59EREl/VkatAZYl9qF.MI5u3Db4vV/bK/pkHXgxHNUrl.CEFMu' as string;

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

	it(`GET /accounts/settings - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const { status } = await request(app).get('/accounts/settings');

		expect(status).toEqual(401);
	});

	it(`POST /accounts/settings - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const { status, body } = await request(app)
			.post('/accounts/settings')
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(Array.isArray(body)).toBeTruthy();
	});

	it(`POST /accounts/settings?force=true - should return statusCode 201 (${STATUS_CODES[201]})`, async () => {
		const { status, body } = await request(app)
			.post('/accounts/settings?force=true')
			.set('x-access-token', jwt);

		expect(status).toEqual(201);
		expect(Array.isArray(body)).toBeTruthy();
	});

	it(`POST /accounts/settings - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const { status } = await request(app).post('/accounts/settings');

		expect(status).toEqual(401);
	});
});

describe('Testing routes of accounts/settings/accountsEmails', () => {
	beforeAll(async () => {
		// jest.setTimeout(10000);

		const testAccount: IAccount = {
			name: 'jest',
			email: TEST_EMAIL2,
			domain: TEST_DOMAIN2,
			password: HASH_PASSWORD,
		};

		const result = await accountRepository.add(testAccount);

		testAccountId2 = result.id;

		jwt2 = sign(testAccountId2);

		await emailService.creatAccountSettings(TEST_DOMAIN2);

		const testAccountEmail: IAccountEmail = {
			name: 'jest',
			email: TEST_EMAIL3,
			accountId: testAccountId2,
		};

		const result2 = await accountEmailRepository.add(testAccountEmail);

		testAccountEmailId = result2.id;

		await emailService.addEmailIdentity(TEST_EMAIL3);

		const testAccountEmail2: IAccountEmail = {
			name: 'jest',
			email: TEST_EMAIL5,
			accountId: testAccountId2,
		};

		const result3 = await accountEmailRepository.add(testAccountEmail2);

		testAccountEmailId2 = result3.id;

		await emailService.addEmailIdentity(TEST_EMAIL5);
	});

	it(`GET /accounts/settings/accountEmails - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const { status, body } = await request(app)
			.get('/accounts/settings/accountEmails')
			.set('x-access-token', jwt2);

		expect(status).toEqual(200);
		expect(Array.isArray(body)).toBeTruthy();
	});

	it(`PUT /accounts/settings/accountEmails - should return statusCode 201 (${STATUS_CODES[201]})`, async () => {
		const payload = {
			name: 'jest',
			email: TEST_EMAIL4,
		} as IAccountEmail;

		const { status, body } = await request(app)
			.put('/accounts/settings/accountEmails')
			.send(payload)
			.set('x-access-token', jwt2);

		expect(status).toEqual(201);
		expect(Array.isArray(body)).toBeTruthy();
	});

	it(`PUT /accounts/settings/accountEmails - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const payload = {
			name: 'jest',
			email: TEST_EMAIL3,
		} as IAccountEmail;

		const { status } = await request(app)
			.put('/accounts/settings/accountEmails')
			.send(payload)
			.set('x-access-token', jwt2);

		expect(status).toEqual(400);
	});

	it(`PUT /accounts/settings/accountEmails - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const payload = {
			name: 'jest',
			email: TEST_EMAIL4,
		} as IAccountEmail;

		const { status } = await request(app)
			.put('/accounts/settings/accountEmails')
			.send(payload);

		expect(status).toEqual(401);
	});

	it(`PUT /accounts/settings/accountEmails - should return statusCode 403 (${STATUS_CODES[403]})`, async () => {
		const payload = {
			name: 'jest',
			email: `${TEST_EMAIL3}.br`,
		} as IAccountEmail;

		const { status } = await request(app)
			.put('/accounts/settings/accountEmails')
			.send(payload)
			.set('x-access-token', jwt2);

		expect(status).toEqual(403);
	});

	it(`PUT /accounts/settings/accountEmails - should return statusCode 422 (${STATUS_CODES[422]})`, async () => {
		const payload = { street: 'jest' };

		const { status } = await request(app)
			.put('/accounts/settings/accountEmails')
			.send(payload)
			.set('x-access-token', jwt2);

		expect(status).toEqual(422);
	});

	it(`PATCH /accounts/settings/accountEmails/:id - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const payload = { name: 'luiz' };

		const {
			status,
			body: { name },
		} = await request(app)
			.patch(`/accounts/settings/accountEmails/${testAccountEmailId}`)
			.send(payload)
			.set('x-access-token', jwt2);

		expect(status).toEqual(200);
		expect(name).toEqual('luiz');
	});

	it(`PATCH /accounts/settings/accountEmails/:id - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const payload = { name: 'luiz' };

		const { status } = await request(app)
			.patch('/accounts/settings/accountEmails/abc')
			.send(payload)
			.set('x-access-token', jwt2);

		expect(status).toEqual(400);
	});

	it(`PATCH /accounts/settings/accountEmails/:id - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const payload = { name: 'luiz' };

		const { status } = await request(app)
			.patch('/accounts/settings/accountEmails/abc')
			.send(payload);

		expect(status).toEqual(401);
	});

	it(`PATCH /accounts/settings/accountEmails/:id - should return statusCode 404 (${STATUS_CODES[404]})`, async () => {
		const payload = { name: 'luiz' };

		const { status } = await request(app)
			.patch('/accounts/settings/accountEmails/-1')
			.send(payload)
			.set('x-access-token', jwt2);

		expect(status).toEqual(404);
	});

	it(`PATCH /accounts/settings/accountEmails/:id - should return statusCode 422 (${STATUS_CODES[422]})`, async () => {
		const payload = { street: 'luiz' };

		const { status } = await request(app)
			.patch(`/accounts/settings/accountEmails/${testAccountEmailId}`)
			.send(payload)
			.set('x-access-token', jwt2);

		expect(status).toEqual(422);
	});

	it(`DELETE /accounts/settings/accountEmails/:id - should return statusCode 204 (${STATUS_CODES[204]})`, async () => {
		const { status } = await request(app)
			.delete(`/accounts/settings/accountEmails/${testAccountEmailId2}`)
			.set('x-access-token', jwt2);

		expect(status).toEqual(204);
	});

	it(`DELETE /accounts/settings/accountEmails/:id - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const { status } = await request(app)
			.delete('/accounts/settings/accountEmails/abc')
			.set('x-access-token', jwt2);

		expect(status).toEqual(400);
	});

	it(`DELETE /accounts/settings/accountEmails/:id - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const { status } = await request(app).delete(
			`/accounts/settings/accountEmails/${testAccountEmailId2}`
		);

		expect(status).toEqual(401);
	});

	it(`DELETE /accounts/settings/accountEmails/:id - should return statusCode 404 (${STATUS_CODES[404]})`, async () => {
		const { status } = await request(app)
			.delete('/accounts/settings/accountEmails/-1')
			.set('x-access-token', jwt2);

		expect(status).toEqual(404);
	});
});

afterAll(async () => {
	// jest.setTimeout(10000);

	await emailService.removeEmailIdentity(TEST_DOMAIN);
	await emailService.removeEmailIdentity(TEST_DOMAIN2);
	await emailService.removeEmailIdentity(TEST_EMAIL);
	await emailService.removeEmailIdentity(TEST_EMAIL2);
	await emailService.removeEmailIdentity(TEST_EMAIL3);
	await emailService.removeEmailIdentity(TEST_EMAIL4);
	await emailService.removeEmailIdentity(TEST_EMAIL5);

	await accountEmailRepository.removeByEmail(TEST_EMAIL, testAccountId);
	await accountEmailRepository.removeByEmail(TEST_EMAIL2, testAccountId2);
	await accountEmailRepository.removeByEmail(TEST_EMAIL3, testAccountId2);
	await accountEmailRepository.removeByEmail(TEST_EMAIL4, testAccountId2);
	await accountEmailRepository.removeByEmail(TEST_EMAIL3, testAccountId2);

	await accountRepository.removeByEmail(TEST_EMAIL);
	await accountRepository.removeByEmail(TEST_EMAIL2);
	await accountRepository.removeByEmail(TEST_EMAIL3);
	await accountRepository.removeByEmail(TEST_EMAIL4);
	await accountRepository.removeByEmail(TEST_EMAIL5);
});
