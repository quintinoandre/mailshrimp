async function parseMessages(event) {
	const messages = await Promise.all(
		event.Records.map((record) => {
			const { body } = record;

			if (typeof body === 'string') {
				return JSON.parse(body);
			}

			return body;
		})
	);

	return messages;
}

module.exports = { parseMessages };
