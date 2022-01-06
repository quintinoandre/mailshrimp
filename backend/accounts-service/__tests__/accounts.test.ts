import request from 'supertest';

import app from '../src/app';

describe('Testing routes of accounts', () => {
	it('GET /accounts/ - should return statusCode 200 (OK)', async () => {
		const result = await request(app).get('/accounts/');

		expect(result.status).toEqual(200);
		expect(Array.isArray(result.body)).toBeTruthy();
	});

	it('POST /accounts/ - should return statusCode 201 (Created)', async () => {
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

	it('POST /accounts/ - should return statusCode 422 (Unprocessable Entity)', async () => {
		const payload = {
			id: 1,
			street: 'rua dos tupis',
			city: 'Gravatai',
			state: 'RS',
		};

		const result = await request(app).post('/accounts/').send(payload);

		expect(result.status).toEqual(422);
	});

	it('PATCH /accounts/:id - should return statusCode 200 (OK)', async () => {
		const payload = {
			name: 'Daniel Castro',
			email: 'danielcastro.rs@gmail.com',
			password: '123456789',
		};
		const result = await request(app).patch('/accounts/1').send(payload);

		expect(result.status).toEqual(200);
		expect(result.body.id).toEqual(1);
	});

	it('PATCH /accounts/:id - should return statusCode 400 (Bad Request)', async () => {
		const payload = {
			name: 'Daniel Castro',
			email: 'danielcastro.rs@gmail.com',
			password: '123456789',
		};
		const result = await request(app).patch('/accounts/abc').send(payload);

		expect(result.status).toEqual(400);
	});

	it('PATCH /accounts/:id - should return statusCode 404 (Not Found)', async () => {
		const payload = {
			name: 'Daniel Castro',
			email: 'danielcastro.rs@gmail.com',
			password: '123456789',
		};
		const result = await request(app).patch('/accounts/-1').send(payload);

		expect(result.status).toEqual(404);
	});

	it('GET /accounts/:id - should return statusCode 200 (OK)', async () => {
		const result = await request(app).get('/accounts/1');

		expect(result.status).toEqual(200);
		expect(result.body.id).toBe(1);
	});

	it('GET /accounts/:id - should return statusCode 404 (Not Found)', async () => {
		const result = await request(app).get('/accounts/2');

		expect(result.status).toEqual(404);
	});

	it('GET /accounts/:id - should return statusCode 400 (Bad Request)', async () => {
		const result = await request(app).get('/accounts/abc');

		expect(result.status).toEqual(400);
	});
});
