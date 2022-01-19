import { STATUS_CODES } from 'http';
import request from 'supertest';
import { v4 as uuid } from 'uuid';

import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';

import microservicesAuth from '../../__commons__/src/api/auth/microservicesAuth';
import accountsApp from '../../accounts-service/src/app';
import contactsApp from '../../contacts-service/src/app';
import app from '../src/app';
import { IMessage } from '../src/models/message';
import messageRepository from '../src/models/messageRepository';
import { MessageStatus } from '../src/models/messageStatus';
import { ISending } from '../src/models/sending';
import sendingRepository from '../src/models/sendingRepository';
import { SendingStatus } from '../src/models/sendingStatus';

const TEST_DOMAIN = 'jest.send.com' as string;
const TEST_EMAIL = `jest@${TEST_DOMAIN}` as string;
const TEST_PASSWORD = '123456' as string;
let testAccountId = 0 as number;
let testAccountEmailId = 0 as number;
let testMessageId = 0 as number;
let testContactId = 0 as number;
let testSendingId = null as string;
let testSendingId2 = null as string;
let jwt = null as string;

beforeAll(async () => {
	const testAccount = {
		name: 'jest',
		email: TEST_EMAIL,
		password: TEST_PASSWORD,
		domain: TEST_DOMAIN,
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

	const testAccountEmail = {
		name: 'jest',
		email: TEST_EMAIL,
		accountId: testAccountId,
	};

	const accountEmailResponse = await request(accountsApp)
		.put('/accounts/settings/accountEmails')
		.send(testAccountEmail)
		.set('x-access-token', jwt);

	console.log(`accountEmailResponse: ${accountEmailResponse.status}`);

	if (accountEmailResponse.status !== 201) throw new Error();

	testAccountEmailId = accountEmailResponse.body.id;

	const testContact = {
		accountId: testAccountId,
		name: 'jest',
		email: TEST_EMAIL,
	};

	const contactResponse = await request(contactsApp)
		.post('/contacts')
		.send(testContact)
		.set('x-access-token', jwt);

	console.log(`contactResponse: ${contactResponse.status}`);

	testContactId = contactResponse.body.id;

	const testMessage = {
		accountId: testAccountId,
		body: 'corpo da mensagem',
		subject: 'assunto da mensagem',
		accountEmailId: testAccountEmailId,
	} as IMessage;

	const addResult = await messageRepository.add(testMessage, testAccountId);

	console.log(`addResult: ${addResult}`);

	testMessageId = addResult.id;

	const testSending = {
		accountId: testAccountId,
		messageId: testMessageId,
		contactId: testContactId,
		status: SendingStatus.QUEUED,
		id: uuid(),
	} as ISending;

	const sendingResult = await sendingRepository.add(testSending);

	console.log(`sendingResult: ${sendingResult.id}`);

	if (!sendingResult.id) throw new Error();

	testSendingId = sendingResult.id;

	const testSending2 = {
		accountId: testAccountId,
		messageId: testMessageId,
		contactId: testContactId,
		status: SendingStatus.QUEUED,
		id: uuid(),
	} as ISending;

	const sendingResult2 = await sendingRepository.add(testSending2);

	console.log(`sendingResult2: ${sendingResult2}`);

	if (!sendingResult2.id) throw new Error();

	testSendingId2 = sendingResult2.id;
});

afterAll(async () => {
	const sendingResult = await sendingRepository.removeById(
		testSendingId,
		testAccountId
	);
	const sendingResult2 = await sendingRepository.removeById(
		testSendingId2,
		testAccountId
	);

	console.log(`sendingResult: ${sendingResult}:${sendingResult2}`);

	const removeResult = await messageRepository.removeById(
		testMessageId,
		testAccountId
	);

	console.log(`removeResult: ${removeResult}`);

	const deleteContactResponse = await request(contactsApp)
		.delete(`/contacts/${testContactId}?force=true`)
		.set('x-access-token', jwt);

	console.log(`deleteContactResponse: ${deleteContactResponse.status}`);

	const deleteAccountEmailResponse = await request(accountsApp)
		.delete(`/accounts/settings/accountEmails/${testAccountEmailId}?force=true`)
		.set('x-access-token', jwt);

	console.log(
		`deleteAccountEmailResponse ${deleteAccountEmailResponse.status}`
	);

	const deleteAccountResponse = await request(accountsApp)
		.delete(`/accounts/${testAccountId}?force=true`)
		.set('x-access-token', jwt);

	console.log(`deleteAccountResponse ${deleteAccountResponse.status}`);

	const logoutResponse = await request(accountsApp)
		.post(`/accounts/logout`)
		.set('x-access-token', jwt);

	console.log(`logoutResponse ${logoutResponse.status}`);
});

describe('Testing routes of messages', () => {
	it(`POST /messages/:id/send - should return statusCode 202 (${STATUS_CODES[202]})`, async () => {
		const {
			status,
			body: { id, status: bodyStatus },
		} = await request(app)
			.post(`/messages/${testMessageId}/send`)
			.set('x-access-token', jwt);

		expect(status).toEqual(202);
		expect(id).toEqual(testMessageId);
		expect(bodyStatus).toEqual(MessageStatus.SCHEDULE);
	});

	it(`POST /messages/:id/send - should return statusCode 401 (${STATUS_CODES[401]})`, async () => {
		const { status } = await request(app).post(
			`/messages/${testMessageId}/send`
		);

		expect(status).toEqual(401);
	});

	it(`POST /messages/:id/send - should return statusCode 403 (${STATUS_CODES[403]})`, async () => {
		const { status } = await request(app)
			.post('/messages/-1/send')
			.set('x-access-token', jwt);

		expect(status).toEqual(403);
	});

	it(`POST /messages/:id/send - should return statusCode 400 (${STATUS_CODES[400]})`, async () => {
		const { status } = await request(app)
			.post('/messages/abc/send')
			.set('x-access-token', jwt);

		expect(status).toEqual(400);
	});

	it(`POST /messages/sending - should return statusCode 202 (${STATUS_CODES[202]})`, async () => {
		const payload = {
			id: testSendingId,
			accountId: testAccountId,
			contactId: testContactId,
			messageId: testMessageId,
		} as ISending;

		const msJwt = await microservicesAuth.sign(payload);

		const {
			status,
			body: { id, status: bodyStatus },
		} = await request(app)
			.post('/messages/sending')
			.set('x-access-token', `${msJwt}`)
			.send(payload);

		expect(status).toEqual(202);
		expect(id).toEqual(testSendingId);
		expect(bodyStatus).toEqual(SendingStatus.SENT);
	});
});
