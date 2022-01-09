import { STATUS_CODES } from 'http';
import request from 'supertest';

import { jest, describe, expect, it, beforeAll, afterAll } from '@jest/globals';

import accountsApp from '../../accounts-service/src/app';
import app from '../src/app';
import { findAll } from '../src/models/contactRepository';
import { IContact } from '../src/models/contacts';

const TEST_EMAIL = 'jest@accounts.com';
const TEST_EMAIL2 = 'jest2@accounts.com';
const TEST_PASSWORD = '123456';
let testAccountId: number = 0;
const testContactId: number = 0;
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
});

afterAll(async () => {
	await request(accountsApp).post(`/accounts/logout}`);

	await request(accountsApp).delete(`/accounts/${testAccountId}`);
});

describe('Testing routes of contacts', () => {
	it(`GET /contacts/ - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const result = await request(app)
			.get('/contacts/')
			.set('x-access-token', jwt);

		expect(result.status).toEqual(200);
		expect(Array.isArray(result.body)).toBeTruthy();
	});
});
