import AWS from 'aws-sdk';

const { AWS_QUEUE_REGION, AWS_QUEUE_URL, AWS_MESSAGE_GROUP } = process.env;

function sendMessage(message: any) {
	AWS.config.update({ region: AWS_QUEUE_REGION });

	const sqs = new AWS.SQS();

	return sqs
		.sendMessage({
			MessageBody: JSON.stringify(message),
			QueueUrl: `${AWS_QUEUE_URL}`,
			MessageGroupId: `${AWS_MESSAGE_GROUP}`,
		})
		.promise();
}

function paginate(messages: any[], pageSize: number, pageNumber: number) {
	return messages.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

function sendMessageBatch(messages: any[]) {
	const sqs = new AWS.SQS();

	const promises = [];

	const pageSize = 10;

	const qtyPages = Math.ceil(messages.length / pageSize);

	for (let i = 1; i <= qtyPages; i += 1) {
		const messagesPage = paginate(messages, pageSize, i);

		const entries = messagesPage.map((item) => {
			return {
				Id: item.id,
				MessageBody: JSON.stringify(item),
				MessageGroupId: `${AWS_MESSAGE_GROUP}`,
			};
		});

		promises.push(
			sqs
				.sendMessageBatch({
					Entries: entries,
					QueueUrl: `${AWS_QUEUE_URL}`,
				})
				.promise()
		);
	}

	return promises;
}

export default { sendMessage, sendMessageBatch };
