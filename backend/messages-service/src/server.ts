import database from '@ms-commons/data/db';

import app from './app';

(async () => {
	try {
		const { PORT, DB_NAME, MS_NAME } = process.env;

		await database.sync();

		console.log(`Running database ${DB_NAME}!`);

		await app.listen(PORT);

		console.log(`${MS_NAME} running on port ${PORT}!`);
	} catch (error) {
		console.error(`${error}`);
	}
})();
