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
let testMessageId2 = 0;
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
	const removeResult2 = await removeById(testMessageId2 || 0, testAccountId);

	console.log(`removeResult: ${removeResult}:${removeResult2}`);

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
});
