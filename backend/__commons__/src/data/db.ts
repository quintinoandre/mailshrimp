import { Sequelize } from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_LOGS, DB_DIALECT } =
	process.env;

const sequelize = new Sequelize(
	DB_NAME || 'mailshrimp',
	DB_USER || 'root',
	DB_PASSWORD,
	{
		dialect: 'mysql',
		host: DB_HOST || 'localhost',
		port: parseInt(DB_PORT) || 3006,
		logging: DB_LOGS === 'true',
		pool: {
			min: 5,
			max: 15,
			idle: 20000,
			evict: 15000,
			acquire: 30000,
		},
	}
);

export default sequelize;
