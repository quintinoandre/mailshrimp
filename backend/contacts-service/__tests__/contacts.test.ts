import { STATUS_CODES } from 'http';
import request from 'supertest';

import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

import accountsApp from '../../accounts-service/src/app';
import app from '../src/app';
import { IContact } from '../src/models/contact';
import { add, removeByEmail } from '../src/models/contactRepository';
import { ContactStatus } from '../src/models/contactStatus';

const TEST_EMAIL = 'jest@accounts.com';
const TEST_EMAIL2 = 'jest2@accounts.com';
const TEST_PASSWORD = '123456';
let testAccountId = 0;
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

	const loginResponse = await request(accountsApp)
		.post('/accounts/login')
		.send({
			email: TEST_EMAIL,
			password: TEST_PASSWORD,
		});

	console.log(`loginResponse: ${loginResponse.status}`);

	jwt = loginResponse.body.token;

	const testContact = {
		name: 'jest',
		email: TEST_EMAIL,
		phone: '00351123456789',
	} as IContact;

	const addResult = await add(testContact, testAccountId);

	console.log(`addResult: ${addResult}`);

	testContactId = addResult.id;
});

afterAll(async () => {
	const removeResult = await removeByEmail(TEST_EMAIL, testAccountId);
	const removeResult2 = await removeByEmail(TEST_EMAIL2, testAccountId);

	console.log(`removeResult: ${removeResult}:${removeResult2}`);

	const deleteResponse = await request(accountsApp)
		.delete(`/accounts/${testAccountId}?force=true`)
		.set('x-access-token', jwt);

	console.log(`deleteResponse ${deleteResponse.status}`);

	const logoutResponse = await request(accountsApp)
		.post(`/accounts/logout`)
		.set('x-access-token', jwt);

	console.log(`logoutResponse ${logoutResponse.status}`);
});

describe('Testing routes of contacts', () => {
	it(`GET /contacts/ - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const { status, body } = await request(app)
			.get('/contacts/')
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(Array.isArray(body)).toBeTruthy();
	});

	it(`GET /contacts/ - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const { status } = await request(app).get('/contacts/');

		expect(status).toEqual(401);
	});

	it(`GET /contacts/:id - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const {
			status,
			body: { id },
		} = await request(app)
			.get(`/contacts/${testContactId}`)
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(id).toEqual(testContactId);
	});

	it(`GET /contacts/:id - should return statusCode 404 (${STATUS_CODES[404]})`, async () => {
		const { status } = await request(app)
			.get('/contacts/-1')
			.set('x-access-token', jwt);

		expect(status).toEqual(404);
	});

	it(`GET /contacts/:id - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const { status } = await request(app)
			.get('/contacts/abc')
			.set('x-access-token', jwt);

		expect(status).toEqual(400);
	});

	it(`GET /contacts/:id - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const { status } = await request(app).get(`/contacts/${testContactId}`);

		expect(status).toEqual(401);
	});

	it(`POST /contacts/ - should return statusCode 201 (${STATUS_CODES[201]})`, async () => {
		const testContact = {
			name: 'jest2',
			email: TEST_EMAIL2,
			phone: '00351123456789',
		} as IContact;

		const {
			status,
			body: { id },
		} = await request(app)
			.post('/contacts/')
			.set('x-access-token', jwt)
			.send(testContact);

		expect(status).toEqual(201);
		expect(id).toBeTruthy();
	});

	it(`POST /contacts/ - should return statusCode 422 (${STATUS_CODES[422]})`, async () => {
		const payload = { street: 'jest2' };

		const { status } = await request(app)
			.post('/contacts/')
			.set('x-access-token', jwt)
			.send(payload);

		expect(status).toEqual(422);
	});

	it(`POST /contacts/ - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const payload = {
			name: 'jest2',
			email: TEST_EMAIL2,
			phone: '00351123456789',
		} as IContact;

		const { status } = await request(app).post('/contacts/').send(payload);

		expect(status).toEqual(401);
	});

	it(`POST /contacts/ - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const payload = {
			name: 'jest3',
			email: TEST_EMAIL,
			phone: '00351123456789',
		} as IContact;

		const { status } = await request(app)
			.post('/contacts/')
			.set('x-access-token', jwt)
			.send(payload);

		expect(status).toEqual(400);
	});

	it(`PATCH /contacts/:id - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const payload = { name: 'Luiz' };

		const {
			status,
			body: { name },
		} = await request(app)
			.patch(`/contacts/${testContactId}`)
			.set('x-access-token', jwt)
			.send(payload);

		expect(status).toEqual(200);
		expect(name).toEqual(payload.name);
	});

	it(`PATCH /contacts/:id - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const payload = { name: 'Luiz' };

		const { status } = await request(app)
			.patch(`/contacts/${testContactId}`)
			.send(payload);

		expect(status).toEqual(401);
	});

	it(`PATCH /contacts/:id - should return statusCode 422 (${STATUS_CODES[422]})`, async () => {
		const payload = { street: 'Luiz' };

		const { status } = await request(app)
			.patch(`/contacts/${testContactId}`)
			.set('x-access-token', jwt)
			.send(payload);

		expect(status).toEqual(422);
	});

	it(`PATCH /contacts/:id - should return statusCode 404 (${STATUS_CODES[404]})`, async () => {
		const payload = { name: 'Luiz' };

		const { status } = await request(app)
			.patch('/contacts/-1')
			.set('x-access-token', jwt)
			.send(payload);

		expect(status).toEqual(404);
	});

	it(`PATCH /contacts/:id - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const payload = { name: 'Luiz' };

		const { status } = await request(app)
			.patch('/contacts/abc')
			.set('x-access-token', jwt)
			.send(payload);

		expect(status).toEqual(400);
	});

	it(`DELETE /contacts/:id - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const { status, body } = await request(app)
			.delete(`/contacts/${testContactId}`)
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(body.status).toEqual(ContactStatus.REMOVED);
	});

	it(`DELETE /contacts/:id?force=true - should return statusCode 204 (${STATUS_CODES[204]})`, async () => {
		const { status } = await request(app)
			.delete(`/contacts/${testContactId}?force=true`)
			.set('x-access-token', jwt);

		expect(status).toEqual(204);
	});

	it(`DELETE /contacts/:id - should return statusCode 403 (${STATUS_CODES[403]})`, async () => {
		const { status } = await request(app)
			.delete(`/contacts/-1`)
			.set('x-access-token', jwt);

		expect(status).toEqual(403);
	});
});
