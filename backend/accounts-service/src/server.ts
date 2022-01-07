import app from './app';
import database from './db';

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
