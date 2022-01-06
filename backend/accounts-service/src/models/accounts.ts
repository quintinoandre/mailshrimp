import Joi from 'joi';

import { AccountStatus } from './accountStatus';

interface IAccount {
	id: number;
	name: string;
	email: string;
	password: string;
	status: AccountStatus;
}

const accountSchema = Joi.object({
	id: Joi.number().integer().min(1),
	name: Joi.string().alphanum().min(3).max(150).required(),
	email: Joi.string().email().min(8).max(150).required(),
	password: Joi.string().alphanum().min(6).max(50).required(),
	status: Joi.number().integer().min(100).max(400),
});

export { IAccount, accountSchema };
