import Joi from 'joi';

const sendingSchema = Joi.object({
	id: Joi.string()
		.pattern(
			/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
		)
		.required(),
	accountId: Joi.number().integer().min(1).required(),
	contactId: Joi.number().integer().min(1).required(),
	messageId: Joi.number().integer().min(1).required(),
});

export { sendingSchema };
