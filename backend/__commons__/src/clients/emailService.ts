import AWS from 'aws-sdk';

const { AWS_SES_REGION } = process.env;

AWS.config.update({ region: AWS_SES_REGION });

async function addEmailIdentity(domainOrEmail: string) {
	const ses = new AWS.SESV2();

	const params = { EmailIdentity: domainOrEmail };

	await ses.createEmailIdentity(params).promise();
}

export { addEmailIdentity };
