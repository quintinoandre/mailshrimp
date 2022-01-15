import { MessageStatus } from './messageStatus';

export interface IMessage {
	id?: number;
	accountId: number;
	subject: string;
	body: string;
	status?: MessageStatus;
	sendDate?: Date;
}
