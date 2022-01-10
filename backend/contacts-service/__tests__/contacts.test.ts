import { STATUS_CODES } from 'http';
import request from 'supertest';

import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

import accountsApp from '../../accounts-service/src/app';
import app from '../src/app';
import { add, removeByEmail } from '../src/models/contactRepository';
import { IContact } from '../src/models/contacts';

const TEST_EMAIL = 'jest@accounts.com';
const TEST_PASSWORD = '123456';
let testAccountId: number = 0;
let testContactId: number = 0;
let jwt: string = null;

beforeAll(async () => {
	const testAccount = {
		name: 'jest',
		email: TEST_EMAIL,
		password: TEST_PASSWORD,
		domain: 'jest.com',
	};

	const account = await request(accountsApp)
		.post('/accounts/')
		.send(testAccount);

	testAccountId = account.body.id;

	const result = await request(accountsApp).post('/accounts/login').send({
		email: TEST_EMAIL,
		password: TEST_PASSWORD,
	});

	jwt = result.body.token;

	const testContact = {
		name: 'jest',
		email: TEST_EMAIL,
		phone: '00351123456789',
	} as IContact;

	const result2 = await add(testContact, testAccountId);

	testContactId = result2.id;
});

afterAll(async () => {
	await removeByEmail(TEST_EMAIL, testAccountId);

	await request(accountsApp)
		.delete(`/accounts/${testAccountId}`)
		.set('x-access-token', jwt);

	await request(accountsApp)
		.post(`/accounts/logout`)
		.set('x-access-token', jwt);
});

describe('Testing routes of contacts', () => {
	it(`GET /contacts/ - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const result = await request(app)
			.get('/contacts/')
			.set('x-access-token', jwt);

		expect(result.status).toEqual(200);
		expect(Array.isArray(result.body)).toBeTruthy();
	});

	it(`GET /contacts/ - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const result = await request(app).get('/contacts/');

		expect(result.status).toEqual(401);
	});

	it(`GET /contacts/:id - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const result = await request(app)
			.get(`/contacts/${testContactId}`)
			.set('x-access-token', jwt);

		expect(result.status).toEqual(200);
		expect(result.body.id).toEqual(testContactId);
	});

	it(`GET /contacts/:id - should return statusCode 404 (${STATUS_CODES[404]})`, async () => {
		const result = await request(app)
			.get(`/contacts/-1`)
			.set('x-access-token', jwt);

		expect(result.status).toEqual(404);
	});

	it(`GET /contacts/:id - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const result = await request(app)
			.get(`/contacts/abc`)
			.set('x-access-token', jwt);

		expect(result.status).toEqual(400);
	});

	it(`GET /contacts/:id - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const result = await request(app).get(`/contacts/${testContactId}`);

		expect(result.status).toEqual(401);
	});
});
