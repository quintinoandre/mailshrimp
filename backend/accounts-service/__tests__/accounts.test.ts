import { STATUS_CODES } from 'http';
import request from 'supertest';

import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

import app from '../src/app';
import { sign } from '../src/auth';
import { IAccount } from '../src/models/account';
import accountRepository from '../src/models/accountRepository';
import { AccountStatus } from '../src/models/accountStatus';

const TEST_EMAIL = 'jest@accounts.com';
const TEST_EMAIL2 = 'jest2@accounts.com';
const HASH_TEST_PASSWORD =
	'$2a$10$Ive59EREl/VkatAZYl9qF.MI5u3Db4vV/bK/pkHXgxHNUrl.CEFMu';
const TEST_PASSWORD = '123456';
let testId = 0;
let jwt: string = null;

beforeAll(async () => {
	const testAccount: IAccount = {
		name: 'jest',
		email: TEST_EMAIL,
		password: HASH_TEST_PASSWORD,
		domain: 'jest.com',
	};

	const result = await accountRepository.add(testAccount);

	testId = result.id;

	jwt = sign(testId);
});

afterAll(async () => {
	await accountRepository.removeByEmail(TEST_EMAIL);

	await accountRepository.removeByEmail(TEST_EMAIL2);
});

describe('Testing routes of accounts', () => {
	it(`GET /accounts/ - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const { status, body } = await request(app)
			.get('/accounts/')
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(Array.isArray(body)).toBeTruthy();
	});

	it(`POST /accounts/ - should return statusCode 201 (${STATUS_CODES[201]})`, async () => {
		const payload: IAccount = {
			name: 'jest2',
			email: TEST_EMAIL2,
			password: TEST_PASSWORD,
			domain: 'jest2.com',
		};

		const {
			status,
			body: { id },
		} = await request(app).post('/accounts/').send(payload);

		expect(status).toEqual(201);
		expect(id).toBeTruthy();
	});

	it(`POST /accounts/ - should return statusCode 422 (${STATUS_CODES[422]})`, async () => {
		const payload = {
			street: 'rua dos tupis',
			city: 'Gravatai',
			state: 'RS',
		};

		const { status } = await request(app).post('/accounts/').send(payload);

		expect(status).toEqual(422);
	});

	it(`PATCH /accounts/:id - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const payload = { name: 'Daniel Castro' };

		const {
			status,
			body: { id, name },
		} = await request(app)
			.patch(`/accounts/${testId}`)
			.send(payload)
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(id).toEqual(testId);
		expect(name).toEqual(payload.name);
	});

	it(`PATCH /accounts/:id - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const payload = { name: 'Daniel Castro' };

		const { status } = await request(app)
			.patch('/accounts/abc')
			.send(payload)
			.set('x-access-token', jwt);

		expect(status).toEqual(400);
	});

	it(`PATCH /accounts/:id - should return statusCode 403 (${STATUS_CODES[403]})`, async () => {
		const payload = { name: 'Daniel Castro' };

		const { status } = await request(app)
			.patch('/accounts/-1')
			.send(payload)
			.set('x-access-token', jwt);

		expect(status).toEqual(403);
	});

	it('GET /accounts/:id - should return statusCode 200 (OK)', async () => {
		const {
			status,
			body: { id },
		} = await request(app)
			.get(`/accounts/${testId}`)
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(id).toBe(testId);
	});

	it(`GET /accounts/:id - should return statusCode 403 (${STATUS_CODES[403]})`, async () => {
		const { status } = await request(app)
			.get('/accounts/-1')
			.set('x-access-token', jwt);

		expect(status).toEqual(403);
	});

	it(`GET /accounts/:id - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const { status } = await request(app)
			.get('/accounts/abc')
			.set('x-access-token', jwt);

		expect(status).toEqual(400);
	});

	it(`DELETE /accounts/:id - should return statusCode 200 (${STATUS_CODES[200]})`, async () => {
		const { status, body } = await request(app)
			.delete(`/accounts/${testId}`)
			.set('x-access-token', jwt);

		expect(status).toEqual(200);
		expect(body.status).toEqual(AccountStatus.REMOVED);
	});

	it(`DELETE /accounts/:id?force=true - should return statusCode 204 (${STATUS_CODES[204]})`, async () => {
		const { status } = await request(app)
			.delete(`/accounts/${testId}?force=true`)
			.set('x-access-token', jwt);

		expect(status).toEqual(204);
	});

	it(`DELETE /accounts/:id - should return statusCode 403 (${STATUS_CODES[403]})`, async () => {
		const { status } = await request(app)
			.delete(`/accounts/-1`)
			.set('x-access-token', jwt);

		expect(status).toEqual(403);
	});
});
