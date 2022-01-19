import { STATUS_CODES } from 'http';
import request from 'supertest';

import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

import accountsApp from '../../accounts-service/src/app';
import app from '../src/app';
import { IMessage } from '../src/models/message';
import messageRepository from '../src/models/messageRepository';
import { MessageStatus } from '../src/models/messageStatus';

const TEST_DOMAIN = 'jest.test.com' as string;
const TEST_EMAIL = `jest@${TEST_DOMAIN}` as string;
const TEST_PASSWORD = '123456' as string;
let testAccountId = 0 as number;
let testAccountEmailId = 0 as number;
let testMessageId = 0 as number;
let testMessageId2 = 0 as number;
let jwt = null as string;

beforeAll(async () => {
	const testAccount = {
		name: 'jest',
		email: TEST_EMAIL,
		password: TEST_PASSWORD,
		domain: TEST_DOMAIN,
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

	const testAccountEmail = {
		name: 'jest',
		email: TEST_EMAIL,
		accountId: testAccountId,
	};

	const accountEmailResponse = await request(accountsApp)
		.put('/accounts/settings/accountEmails')
		.send(testAccountEmail)
		.set('x-access-token', jwt);

	console.log(`accountEmailResponse: ${accountEmailResponse.status}`);

	if (accountEmailResponse.status !== 201) throw new Error();

	testAccountEmailId = accountEmailResponse.body.id;

	const testMessage = {
		accountId: testAccountId,
		body: 'corpo da mensagem',
		subject: 'assunto da mensagem',
		accountEmailId: testAccountEmailId,
	} as IMessage;

	const addResult = await messageRepository.add(testMessage, testAccountId);

	console.log(`addResult: ${addResult}`);

	testMessageId = addResult.id;
});

afterAll(async () => {
	const removeResult = await messageRepository.removeById(
		testMessageId,
		testAccountId
	);
	const removeResult2 = await messageRepository.removeById(
		testMessageId2 || 0,
		testAccountId
	);

	console.log(`removeResult: ${removeResult}:${removeResult2}`);

	const deleteAccountEmailResponse = await request(accountsApp)
		.delete(`/accounts/settings/accountEmails/${testAccountEmailId}?force=true`)
		.set('x-access-token', jwt);

	console.log(
		`deleteAccountEmailResponse ${deleteAccountEmailResponse.status}`
	);

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
	it(`GET /messages/ - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const { status, body } = await request(app)
			.get('/messages/')
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(Array.isArray(body)).toBeTruthy();
	});

	it(`GET /messages/ - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const { status } = await request(app).get('/messages/');

		expect(status).toEqual(401);
	});

	it(`GET /messages/:id - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const {
			status,
			body: { id },
		} = await request(app)
			.get(`/messages/${testMessageId}`)
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(id).toEqual(testMessageId);
	});

	it(`GET /messages/:id - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const { status } = await request(app).get(`/messages/${testMessageId}`);

		expect(status).toEqual(401);
	});

	it(`GET /messages/:id - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const { status } = await request(app)
			.get('/messages/abc')
			.set('x-access-token', jwt);

		expect(status).toEqual(400);
	});

	it(`GET /messages/:id - should return statusCode 404 (${STATUS_CODES[404]})`, async () => {
		const { status } = await request(app)
			.get('/messages/-1')
			.set('x-access-token', jwt);

		expect(status).toEqual(404);
	});

	it(`POST /messages/ - should return statusCode 201 (${STATUS_CODES[201]})`, async () => {
		const payload = {
			accountId: testAccountId,
			subject: 'outro subject',
			body: 'outro body',
			accountEmailId: testAccountEmailId,
		} as IMessage;

		const {
			status,
			body: { id },
		} = await request(app)
			.post('/messages/')
			.set('x-access-token', jwt)
			.send(payload);

		testMessageId2 = parseInt(id);

		expect(status).toEqual(201);
		expect(id).toBeTruthy();
	});

	it(`POST /messages/ - should return statusCode 422 (${STATUS_CODES[422]})`, async () => {
		const payload = { street: 'minha rua' };

		const { status } = await request(app)
			.post('/messages/')
			.set('x-access-token', jwt)
			.send(payload);

		expect(status).toEqual(422);
	});

	it(`POST /messages/ - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const payload = {
			accountId: testAccountId,
			subject: 'outro subject',
			body: 'outro body',
		} as IMessage;

		const { status } = await request(app).post('/messages/').send(payload);

		expect(status).toEqual(401);
	});

	it(`PATCH /messages/:id - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const payload = { subject: 'subject alterado' };

		const {
			status,
			body: { subject },
		} = await request(app)
			.patch(`/messages/${testMessageId}`)
			.set('x-access-token', jwt)
			.send(payload);

		expect(status).toEqual(200);
		expect(subject).toEqual(payload.subject);
	});

	it(`PATCH /messages/:id - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const payload = { subject: 'subject alterado' };

		const { status } = await request(app)
			.patch(`/messages/${testMessageId}`)
			.send(payload);

		expect(status).toEqual(401);
	});

	it(`PATCH /messages/:id - should return statusCode 422 (${STATUS_CODES[422]})`, async () => {
		const payload = { street: 'Luiz' };

		const { status } = await request(app)
			.patch(`/messages/${testMessageId}`)
			.set('x-access-token', jwt)
			.send(payload);

		expect(status).toEqual(422);
	});

	it(`PATCH /messages/:id - should return statusCode 404 (${STATUS_CODES[404]})`, async () => {
		const payload = { subject: 'subject alterado' };

		const { status } = await request(app)
			.patch('/messages/-1')
			.set('x-access-token', jwt)
			.send(payload);

		expect(status).toEqual(404);
	});

	it(`PATCH /messages/:id - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const payload = { subject: 'subject alterado' };

		const { status } = await request(app)
			.patch('/messages/abc')
			.set('x-access-token', jwt)
			.send(payload);

		expect(status).toEqual(400);
	});

	it(`DELETE /messages/:id - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const { status, body } = await request(app)
			.delete(`/messages/${testMessageId}`)
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(body.status).toEqual(MessageStatus.REMOVED);
	});

	it(`DELETE /messages/:id?force=true - should return statusCode 204 (${STATUS_CODES[204]})`, async () => {
		const { status } = await request(app)
			.delete(`/messages/${testMessageId}?force=true`)
			.set('x-access-token', jwt);

		expect(status).toEqual(204);
	});

	it(`DELETE /messages/:id - should return statusCode 403 (${STATUS_CODES[403]})`, async () => {
		const { status } = await request(app)
			.delete(`/messages/-1`)
			.set('x-access-token', jwt);

		expect(status).toEqual(403);
	});
});
