const jwt = require('jsonwebtoken');

const { MS_JWT_SECRET: SECRET, MS_JWT_EXPIRATION: EXPIRATION } = process.env;

async function sign(token) {
	try {
		return jwt.sign(token, SECRET, { expiresIn: EXPIRATION });
	} catch (error) {
		console.error(`sign: ${error}`);

		return null;
	}
}

module.exports = { sign };
