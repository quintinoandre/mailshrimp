import Joi from 'joi';

const contactSchema = Joi.object({
	id: Joi.number().integer().min(1),
	accountId: Joi.number().integer().min(1),
	name: Joi.string().min(3).max(150).required(),
	email: Joi.string().email().min(8).max(150).required(),
	phone: Joi.string().pattern(/^[0-9]{9,14}$/),
	status: Joi.number().integer().min(100).max(400),
});

const contactUpdateSchema = Joi.object({
	name: Joi.string().min(3).max(150).required(),
	phone: Joi.string().pattern(/^[0-9]{9,14}$/),
	status: Joi.number().integer().min(100).max(400),
});

export { contactSchema, contactUpdateSchema };
