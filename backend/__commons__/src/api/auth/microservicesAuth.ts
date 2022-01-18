import jwt from 'jsonwebtoken';

const { MS_JWT_SECRET, MS_JWT_EXPIRES } = process.env;

const SECRET = `${MS_JWT_SECRET}`;
const EXPIRATION: number = parseInt(MS_JWT_EXPIRES);

async function sign(token: any) {
	try {
		return jwt.sign(token, SECRET, { expiresIn: EXPIRATION });
	} catch (error) {
		console.error(`sign: ${error}`);

		return null;
	}
}

async function verify(token: string) {
	try {
		return jwt.verify(token, SECRET);
	} catch (error) {
		console.error(`verify: ${error}`);

		return null;
	}
}

export default { sign, verify };
