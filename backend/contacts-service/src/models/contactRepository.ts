import contactModel, { IContactModel } from './contactModel';
import { IContact } from './contacts';

function findAll(accountId: number) {
	return contactModel.findAll<IContactModel>({ where: { accountId } });
}

export { findAll };
