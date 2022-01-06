import request from 'supertest';

import app from '../src/app';

describe('Testing routes of authentication', () => {
	it('POST /accounts/login - should return statusCode 200 (OK)', async () => {
		// ? mocking
		const newAccount = {
			id: 1,
			name: 'Daniel',
			email: 'danielcastro.rs@gmail.com',
			password: '123456',
		};

		await request(app).post('/accounts/').send(newAccount);

		// ? testing
		const payload = {
			email: 'danielcastro.rs@gmail.com',
			password: '123456',
		};

		const result = await request(app).post('/accounts/login').send(payload);

		expect(result.status).toEqual(200);
		expect(result.body.auth).toBeTruthy();
		expect(result.body.token).toBeTruthy();
	});

	it('POST /accounts/login - should return statusCode 422 (Unprocessable Entity)', async () => {
		const payload = {
			email: 'danielcastro.rs@gmail.com',
			password: 'abc',
		};

		const result = await request(app).post('/accounts/login').send(payload);

		expect(result.status).toEqual(422);
	});

	it('POST /accounts/login - should return statusCode 401 (Unauthorized)', async () => {
		const payload = {
			email: 'danielcastro.rs@gmail.com',
			password: 'abc123',
		};

		const result = await request(app).post('/accounts/login').send(payload);

		expect(result.status).toEqual(401);
	});

	it('POST /accounts/logout - should return statusCode 200 (OK)', async () => {
		const result = await request(app).post('/accounts/logout');

		expect(result.status).toEqual(200);
	});
});
