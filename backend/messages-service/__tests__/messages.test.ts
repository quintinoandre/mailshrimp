import { STATUS_CODES } from 'http';
import request from 'supertest';

import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

import accountsApp from '../../accounts-service/src/app';
import app from '../src/app';
import { IMessage } from '../src/models/message';
import { add, removeById } from '../src/models/messageRepository';

const TEST_EMAIL = 'jest@accounts.com';
const TEST_PASSWORD = '123456';
let testAccountId = 0;
let testMessageId = 0;
let jwt: string = null;

beforeAll(async () => {
	const testAccount = {
		name: 'jest',
		email: TEST_EMAIL,
		password: TEST_PASSWORD,
		domain: 'jest.com',
	};

	const accountResponse = await request(accountsApp)
		.post('/accounts/')
		.send(testAccount);

	console.log(`accountResponse: ${accountResponse.status}`);

	testAccountId = accountResponse.body.id;

	const loginResponse = await request(accountsApp)
		.post('/accounts/login')
		.send({
			email: TEST_EMAIL,
			password: TEST_PASSWORD,
		});

	console.log(`loginResponse: ${loginResponse.status}`);

	jwt = loginResponse.body.token;

	const testMessage = {
		accountId: testAccountId,
		body: 'corpo da mensagem',
		subject: 'assunto da mensagem',
	} as IMessage;

	const addResult = await add(testMessage, testAccountId);

	console.log(`addResult: ${addResult}`);

	testMessageId = addResult.id;
});

afterAll(async () => {
	const removeResult = await removeById(testMessageId, testAccountId);

	console.log(`removeResult: ${removeResult}`);

	const deleteResponse = await request(accountsApp)
		.delete(`/accounts/${testAccountId}`)
		.set('x-access-token', jwt);

	console.log(`deleteResponse ${deleteResponse.status}`);

	const logoutResponse = await request(accountsApp)
		.post(`/accounts/logout`)
		.set('x-access-token', jwt);

	console.log(`logoutResponse ${logoutResponse.status}`);
});

describe('Testing routes of messages', () => {
	it(`GET /messages/ - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const { status, body } = await request(app)
			.get('/messages/')
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(Array.isArray(body)).toBeTruthy();
	});
});
