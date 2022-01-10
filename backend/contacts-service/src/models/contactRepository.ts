import contactModel, { IContactModel } from './contactModel';
import { IContact } from './contacts';

function findAll(accountId: number) {
	return contactModel.findAll<IContactModel>({ where: { accountId } });
}

function findById(contactId: number, accountId: number) {
	return contactModel.findOne<IContactModel>({
		where: { id: contactId, accountId },
	});
}

async function add(contact: IContact, accountId: number) {
	const newContact = { ...contact };

	newContact.accountId = accountId;

	const result = await contactModel.create(newContact);

	newContact.id = result.id;

	return newContact;
}

function removeById(contactId: number, accountId: number) {
	return contactModel.destroy({ where: { id: contactId, accountId } });
}

function removeByEmail(email: string, accountId: number) {
	return contactModel.destroy({ where: { email, accountId } });
}

export { findAll, findById, add, removeById, removeByEmail };
