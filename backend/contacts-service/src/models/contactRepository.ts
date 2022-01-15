import { IContact } from './contact';
import contactModel, { IContactModel } from './contactModel';
import { ContactStatus } from './contactStatus';

function findAll(accountId: number, includeRemoved: boolean) {
	const { SUBSCRIBED, UNSUBSCRIBED } = ContactStatus;

	if (includeRemoved)
		return contactModel.findAll<IContactModel>({ where: { accountId } });

	return contactModel.findAll<IContactModel>({
		where: { accountId, status: [SUBSCRIBED, UNSUBSCRIBED] },
	});
}

function findById(contactId: number, accountId: number) {
	return contactModel.findOne<IContactModel>({
		where: { id: contactId, accountId },
	});
}

async function add(contact: IContact, accountId: number) {
	const newContact = contact;

	newContact.accountId = accountId;

	const { id } = await contactModel.create(newContact);

	newContact.id = id;

	return newContact;
}

async function set(contactId: number, contact: IContact, accountId: number) {
	const newContact = contact;

	const originalContact = await contactModel.findOne({
		where: { id: contactId, accountId },
	});

	if (originalContact) {
		if (newContact.name && newContact.name !== originalContact.name)
			originalContact.name = newContact.name;

		if (newContact.phone && newContact.phone !== originalContact.phone)
			originalContact.phone = newContact.phone;

		if (newContact.status && newContact.status !== originalContact.status)
			originalContact.status = newContact.status;

		const { id } = await originalContact.save();

		newContact.id = id;

		return newContact;
	}

	return null;
}

function removeById(contactId: number, accountId: number) {
	return contactModel.destroy({ where: { id: contactId, accountId } });
}

function removeByEmail(email: string, accountId: number) {
	return contactModel.destroy({ where: { email, accountId } });
}

export { findAll, findById, add, set, removeById, removeByEmail };
