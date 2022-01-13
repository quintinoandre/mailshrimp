import bcrypt from 'bcryptjs';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';

import authCommons, { Token } from '@ms-commons/api/auth';

const privateKey = fs.readFileSync(
	path.join(authCommons.findKeysPath(__dirname), 'private.key'),
	'utf8'
);

const { JWT_EXPIRES } = process.env;

const JWT_ALGORITHM = 'RS256';

function hashPassword(password: string) {
	return bcrypt.hashSync(password, 10);
}

function comparePassword(password: string, hashedPassword: string) {
	return bcrypt.compareSync(password, hashedPassword);
}

function sign(accountId: number) {
	const token: Token = { accountId };

	return jwt.sign(token, privateKey, {
		expiresIn: parseInt(JWT_EXPIRES),
		algorithm: JWT_ALGORITHM,
	});
}

async function verify(token: string) {
	return authCommons.verify(token);
}

export { hashPassword, comparePassword, sign, verify };
