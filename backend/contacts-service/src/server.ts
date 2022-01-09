import database from '@ms-commons/data/db';

import app from './app';

(async () => {
	try {
		const { PORT, DB_NAME } = process.env;

		await database.sync();

		console.log(`Running database ${DB_NAME}!`);

		await app.listen(PORT);

		console.log(`Running on port ${PORT}!`);
	} catch (error) {
		console.log(`${error}`);
	}
})();
