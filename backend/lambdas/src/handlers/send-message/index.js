/**
 * Esta função deve receber uma payload da fila
 * Gerar um JWT com a secret das variáveis de ambiente
 * Realizar uma chamada para o backend enviando o jwt + payload
 * O retorno (statusCode) dessa chamada será um 202
 */

const fetch = require('node-fetch');

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

			const url = `${MS_URL_MESSAGES}/messages/sendings`;

			const checkStatus = (res) => {
				if (res.ok) {
					// qualquer status >= 200 e < 300
					return res;
				}
				throw Error(res.statusText);
			};

			fetch(url, {
				method: 'post',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json',
					'x-access-token': msJWT,
				},
			})
				.then(checkStatus)
				.then((res) => {
					return {
						statusCode: 200,
						body: JSON.stringify(res),
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
