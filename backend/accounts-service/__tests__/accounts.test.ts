import request from 'supertest';

import app from '../src/app';

describe('Testing routes of accounts', () => {
	it('GET /accounts/ - should return statusCode 200', async () => {
		const result = await request(app).get('/accounts/');

		expect(result.status).toEqual(200);
		expect(Array.isArray(result.body)).toBeTruthy();
	});

	it('POST /accounts/ - should return statusCode 201', async () => {
		const payload = {
			id: 1,
			name: 'Daniel',
			email: 'danielcastro.rs@gmail.com',
			password: '123456',
		};

		const result = await request(app).post('/accounts/').send(payload);

		expect(result.status).toEqual(201);
		expect(result.body.id).toBe(1);
	});

	it('POST /accounts/ - should return statusCode 422', async () => {
		const payload = {
			id: 1,
			street: 'rua dos tupis',
			city: 'Gravatai',
			state: 'RS',
		};

		const result = await request(app).post('/accounts/').send(payload);

		expect(result.status).toEqual(422);
	});

	it('GET /accounts/:id - should return statusCode 200', async () => {
		const result = await request(app).get('/accounts/1');

		expect(result.status).toEqual(200);
		expect(result.body.id).toBe(1);
	});

	it('GET /accounts/:id - should return statusCode 404', async () => {
		const result = await request(app).get('/accounts/2');

		expect(result.status).toEqual(404);
	});

	it('GET /accounts/:id - should return statusCode 400', async () => {
		const result = await request(app).get('/accounts/abc');

		expect(result.status).toEqual(400);
	});
});
