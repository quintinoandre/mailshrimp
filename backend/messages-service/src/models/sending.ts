import { SendingStatus } from './sendingStatus';

export interface ISending {
	id?: string;
	accountId: number;
	contactId: number;
	messageId: number;
	sendDate?: Date;
	status?: SendingStatus;
}
