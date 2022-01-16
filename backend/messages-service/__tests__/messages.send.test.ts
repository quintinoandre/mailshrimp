import { STATUS_CODES } from 'http';
import request from 'supertest';

import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

import accountsApp from '../../accounts-service/src/app';
import contactsApp from '../../contacts-service/src/app';
import app from '../src/app';
import { IMessage } from '../src/models/message';
import { add, removeById } from '../src/models/messageRepository';
import { MessageStatus } from '../src/models/messageStatus';

const TEST_EMAIL = 'jest@accounts.com';
const TEST_PASSWORD = '123456';
let testAccountId = 0;
let testMessageId = 0;
let testContactId = 0;
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

	const testContact = {
		accountId: testAccountId,
		name: 'jest',
		email: TEST_EMAIL,
	};

	const loginResponse = await request(accountsApp)
		.post('/accounts/login')
		.send({
			email: TEST_EMAIL,
			password: TEST_PASSWORD,
		});

	console.log(`loginResponse: ${loginResponse.status}`);

	jwt = loginResponse.body.token;

	const contactResponse = await request(contactsApp)
		.post('/contacts')
		.send(testContact)
		.set('x-access-token', jwt);

	console.log(`contactResponse: ${contactResponse.status}`);

	testContactId = contactResponse.body.id;

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

	const deleteContactResponse = await request(contactsApp)
		.delete(`/contacts/${testContactId}?force=true`)
		.set('x-access-token', jwt);

	console.log(`deleteContactResponse: ${deleteContactResponse.status}`);

	const deleteAccountResponse = await request(accountsApp)
		.delete(`/accounts/${testAccountId}?force=true`)
		.set('x-access-token', jwt);

	console.log(`deleteAccountResponse ${deleteAccountResponse.status}`);

	const logoutResponse = await request(accountsApp)
		.post(`/accounts/logout`)
		.set('x-access-token', jwt);

	console.log(`logoutResponse ${logoutResponse.status}`);
});

describe('Testing routes of messages', () => {
	it(`POST /messages/:id/send - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const {
			status,
			body: { id, status: bodyStatus },
		} = await request(app)
			.post(`/messages/${testMessageId}/send`)
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(id).toEqual(testMessageId);
		expect(bodyStatus).toEqual(MessageStatus.SENT);
	});

	it(`POST /messages/:id/send - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const { status } = await request(app).post(
			`/messages/${testMessageId}/send`
		);

		expect(status).toEqual(401);
	});

	it(`POST /messages/:id/send - should return statusCode 403 (${STATUS_CODES[403]})`, async () => {
		const { status } = await request(app)
			.post('/messages/-1/send')
			.set('x-access-token', jwt);

		expect(status).toEqual(403);
	});

	it(`POST /messages/:id/send - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const { status } = await request(app)
			.post('/messages/abc/send')
			.set('x-access-token', jwt);

		expect(status).toEqual(400);
	});
});
