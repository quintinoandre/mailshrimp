import { STATUS_CODES } from 'http';
import request from 'supertest';

import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

import app from '../src/app';
import { sign } from '../src/auth';
import { add, removeByEmail } from '../src/models/accountRepository';
import { IAccount } from '../src/models/accounts';

const TEST_EMAIL = 'jest@accounts.com';
const TEST_EMAIL2 = 'jest2@accounts.com';
const HASH_TEST_PASSWORD =
	'$2a$10$Ive59EREl/VkatAZYl9qF.MI5u3Db4vV/bK/pkHXgxHNUrl.CEFMu';
const TEST_PASSWORD = '123456';
let testId: number = 0;
let jwt: string = null;

beforeAll(async () => {
	const testAccount: IAccount = {
		name: 'jest',
		email: TEST_EMAIL,
		password: HASH_TEST_PASSWORD,
		domain: 'jest.com',
	};

	const result = await add(testAccount);

	testId = result.id;

	jwt = sign(testId);
});

afterAll(async () => {
	await removeByEmail(TEST_EMAIL);

	await removeByEmail(TEST_EMAIL2);
});

describe('Testing routes of accounts', () => {
	it(`GET /accounts/ - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const result = await request(app)
			.get('/accounts/')
			.set('x-access-token', jwt);

		expect(result.status).toEqual(200);
		expect(Array.isArray(result.body)).toBeTruthy();
	});

	it(`POST /accounts/ - should return statusCode 201 (${STATUS_CODES[201]})`, async () => {
		const payload: IAccount = {
			name: 'jest2',
			email: TEST_EMAIL2,
			password: TEST_PASSWORD,
			domain: 'jest.com',
		};

		const result = await request(app).post('/accounts/').send(payload);

		expect(result.status).toEqual(201);
		expect(result.body.id).toBeTruthy();
	});

	it(`POST /accounts/ - should return statusCode 422 (${STATUS_CODES[422]})`, async () => {
		const payload = {
			street: 'rua dos tupis',
			city: 'Gravatai',
			state: 'RS',
		};

		const result = await request(app).post('/accounts/').send(payload);

		expect(result.status).toEqual(422);
	});

	it(`PATCH /accounts/:id - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const payload = {
			name: 'Daniel Castro',
		};

		const result = await request(app)
			.patch(`/accounts/${testId}`)
			.send(payload)
			.set('x-access-token', jwt);

		expect(result.status).toEqual(200);
		expect(result.body.id).toEqual(testId);
		expect(result.body.name).toEqual(payload.name);
	});

	it(`PATCH /accounts/:id - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const payload = {
			name: 'Daniel Castro',
		};

		const result = await request(app)
			.patch('/accounts/abc')
			.send(payload)
			.set('x-access-token', jwt);

		expect(result.status).toEqual(400);
	});

	it(`PATCH /accounts/:id - should return statusCode 403 (${STATUS_CODES[403]})`, async () => {
		const payload = {
			name: 'Daniel Castro',
		};

		const result = await request(app)
			.patch('/accounts/-1')
			.send(payload)
			.set('x-access-token', jwt);

		expect(result.status).toEqual(403);
	});

	it('GET /accounts/:id - should return statusCode 200 (OK)', async () => {
		const result = await request(app)
			.get(`/accounts/${testId}`)
			.set('x-access-token', jwt);

		expect(result.status).toEqual(200);
		expect(result.body.id).toBe(testId);
	});

	it(`GET /accounts/:id - should return statusCode 403 (${STATUS_CODES[403]})`, async () => {
		const result = await request(app)
			.get('/accounts/-1')
			.set('x-access-token', jwt);

		expect(result.status).toEqual(403);
	});

	it(`GET /accounts/:id - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const result = await request(app)
			.get('/accounts/abc')
			.set('x-access-token', jwt);

		expect(result.status).toEqual(400);
	});

	it(`DELETE /accounts/:id - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const result = await request(app)
			.delete(`/accounts/${testId}`)
			.set('x-access-token', jwt);

		expect(result.status).toEqual(200);
	});

	it(`DELETE /accounts/:id - should return statusCode 403 (${STATUS_CODES[403]})`, async () => {
		const result = await request(app)
			.delete(`/accounts/-1`)
			.set('x-access-token', jwt);

		expect(result.status).toEqual(403);
	});
});
