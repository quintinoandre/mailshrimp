import AWS from 'aws-sdk';

import { IQueueMessage } from '@models/queueMessage';

const { AWS_QUEUE_REGION, AWS_QUEUE_URL, AWS_MESSAGE_GROUP } = process.env;

function sendMessage(message: IQueueMessage) {
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

export default { sendMessage };
