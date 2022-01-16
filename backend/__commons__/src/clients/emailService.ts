import AWS from 'aws-sdk';

const { AWS_SES_REGION } = process.env;

AWS.config.update({ region: AWS_SES_REGION });

export type DnsRecord = {
	type: string;
	name: string;
	value: string;
	priority?: number;
};

export type DnsSettings = {
	dnsRecords: Array<DnsRecord>;
	verified: boolean;
};

export type AccountSettings = {
	Domain: DnsSettings;
	DKIM: DnsSettings;
	SPF: DnsSettings;
};

async function addEmailIdentity(domainOrEmail: string) {
	const ses = new AWS.SESV2();

	const params = { EmailIdentity: domainOrEmail };

	const result = await ses.createEmailIdentity(params).promise();

	return result;
}

async function setMailFromDomain(domain: string) {
	const ses = new AWS.SESV2();

	const params = {
		EmailIdentity: domain,
		BehaviorOnMxFailure: 'USE_DEFAULT_VALUE',
		MailFromDomain: `mailshrimp.${domain}`,
	};

	const result = ses.putEmailIdentityMailFromAttributes(params).promise();

	return result;
}

async function getDkimSettings(
	domain: string,
	response: AWS.SESV2.GetEmailIdentityResponse
) {
	const dkimArray = response.DkimAttributes.Tokens.map((token) => {
		return {
			type: 'CNAME',
			name: `${token}._domainkey.${domain}`,
			value: `${token}.dkim.amazonses.com`,
		} as DnsRecord;
	});

	return {
		dnsRecords: dkimArray,
		verified: response.DkimAttributes.Status === 'SUCCESS',
	} as DnsSettings;
}

function getSPFSettings(
	domain: string,
	response: AWS.SESV2.GetEmailIdentityResponse
) {
	const mx = {
		type: 'MX',
		name: `mailshrimp.${domain}`,
		value: `feedback-smtp.${process.env.AWS_SES_REGION}.amazonses.com`,
		priority: 10,
	} as DnsRecord;

	const txt = {
		type: 'TXT',
		name: `mailshrimp.${domain}`,
		value: 'v=spf1 include:amazonses.com ~all',
	} as DnsRecord;

	const verified =
		response.MailFromAttributes.MailFromDomainStatus === 'SUCCESS';

	return {
		verified,
		dnsRecords: [mx, txt],
	} as DnsSettings;
}

async function getDomainSettings(domain: string) {
	const ses = new AWS.SES();

	const params = { Identities: [domain] };

	const response = await ses
		.getIdentityVerificationAttributes(params)
		.promise();

	const dnsRecord = {
		type: 'TXT',
		name: `_amazonses.${domain}`,
		value: response.VerificationAttributes[domain].VerificationToken,
	} as DnsRecord;

	const verified =
		response.VerificationAttributes[domain].VerificationStatus === 'Success';

	return {
		verified,
		dnsRecords: [dnsRecord],
	} as DnsSettings;
}

async function getAccountSettings(domain: string) {
	const ses = new AWS.SESV2();

	const params = { EmailIdentity: domain };

	const response = await ses.getEmailIdentity(params).promise();

	const dkimSettings = await getDkimSettings(domain, response);

	const spfSettings = getSPFSettings(domain, response);

	const domainSettings = await getDomainSettings(domain);

	return {
		DKIM: dkimSettings,
		SPF: spfSettings,
		Domain: domainSettings,
	} as AccountSettings;
}

async function creatAccountSettings(domain: string) {
	const identityResponse = await addEmailIdentity(domain);

	const mailFromResponse = await setMailFromDomain(domain);

	const accountSettings = await getAccountSettings(domain);

	return accountSettings;
}

export { addEmailIdentity, creatAccountSettings, getAccountSettings };
