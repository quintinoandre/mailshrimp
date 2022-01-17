import Joi from 'joi';

const accountEmailSchema = Joi.object({
	id: Joi.number().integer().min(1),
	name: Joi.string().min(3).max(150).required(),
	email: Joi.string().email().min(8).max(150).required(),
});

const accountEmailUpdateSchema = Joi.object({
	name: Joi.string().min(3).max(150).required(),
});

export { accountEmailSchema, accountEmailUpdateSchema };
