import fs from 'fs';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import path from 'path';

function findKeysPath(currentPath: string): string {
	const keysPath = path.join(currentPath, 'keys');

	if (fs.existsSync(keysPath)) return keysPath;

	return findKeysPath(path.join(currentPath, '..'));
}

const publicKey = fs.readFileSync(
	path.join(findKeysPath(__dirname), 'public.key'),
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

export { Token };

export default { verify, findKeysPath };
