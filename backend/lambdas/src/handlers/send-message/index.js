/**
 * Esta função deve receber uma payload da fila
 * Gerar um JWT com a secret das variáveis de ambiente
 * Realizar uma chamada para o backend enviando o jwt + payload
 * O retorno (statusCode) dessa chamada será um 202
 */

const request = require('request');

const sqsParse = require('../../../lib/aws-parse-sqs');
const jwt = require('../../../lib/ms-auth');

const { MS_URL_MESSAGES } = process.env;

async function main(event) {
	try {
		const isSQSMessage = Boolean(event.Records);

		if (isSQSMessage) {
			const payloadParsed = await sqsParse.parseMessages(event);

			const payload = payloadParsed[0];

			const msJWT = await jwt.sign(payload);

			const options = {
				url: `${MS_URL_MESSAGES}/messages/sendings`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': data.length,
					'x-access-token': msJWT,
				},
				body: payload,
				json: true,
			};

			await request(options)
				.then((result) => {
					return {
						statusCode: 200,
						body: JSON.stringify({ result }),
					};
				})
				.catch((error) => {
					return {
						statusCode: 500,
						body: JSON.stringify({ error }),
					};
				});
		}

		return null;
	} catch (error) {
		console.error(error);

		return { statusCode: 500, body: JSON.stringify({ error }) };
	}
}

module.exports.sendMessage = main;
