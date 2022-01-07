import bcrypt from 'bcryptjs';
import fs from 'fs';
import jwt, { VerifyOptions } from 'jsonwebtoken';

const privateKey = fs.readFileSync('./keys/private.key', 'utf8');
const publicKey = fs.readFileSync('./keys/public.key', 'utf8');

const { JWT_EXPIRES } = process.env;

const JWT_ALGORITHM = 'RS256';

function hashPassword(password: string) {
	return bcrypt.hashSync(password, 10);
}

function comparePassword(password: string, hashPassword: string) {
	return bcrypt.compareSync(password, hashPassword);
}

type Token = { accountId: number };

function sign(accountId: number) {
	const token: Token = { accountId };

	return jwt.sign(token, privateKey, {
		expiresIn: parseInt(JWT_EXPIRES),
		algorithm: JWT_ALGORITHM,
	});
}

async function verify(token: string) {
	try {
		const tokenDecoded: Token = (await jwt.verify(token, publicKey, {
			algorithm: [JWT_ALGORITHM],
		} as VerifyOptions)) as Token;

		return { accountId: tokenDecoded.accountId };
	} catch (error) {
		console.log(`verify: ${error}`);

		return null;
	}
}

export { hashPassword, comparePassword, sign, verify };
