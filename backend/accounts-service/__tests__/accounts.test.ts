import request from 'supertest';

import app from '../src/app';

describe('Testing routes of accounts', () => {
	it('POST /accounts/ - should return status 201', async () => {
		const payload = {
			id: 1,
			name: 'Daniel',
			email: 'danielcastro.rs@gmail.com',
			password: '123456',
			status: 1,
		};

		const result = await request(app).post('/accounts/').send(payload);

		expect(result.status).toEqual(201);
	});
});
