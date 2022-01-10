import fs from 'fs';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import path from 'path';

const publicKey = fs.readFileSync(
	path.resolve(__dirname, '../../keys/public.key'),
	'utf8'
);

const JWT_ALGORITHM = 'RS256';

type Token = { accountId: number };

async function verify(token: string) {
	try {
		const tokenDecoded: Token = (await jwt.verify(token, publicKey, {
			algorithm: [JWT_ALGORITHM],
		} as VerifyOptions)) as Token;

		return { accountId: tokenDecoded.accountId };
	} catch (error) {
		console.error(`verify: ${error}`);

		return null;
	}
}

export default { verify };

export { Token };
