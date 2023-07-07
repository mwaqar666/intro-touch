export interface IMailer {
	to(...recipients: Array<string>): IMailer;

	cc(...recipients: Array<string>): IMailer;

	bcc(...recipients: Array<string>): IMailer;

	send<T>(emailTemplate: string, data: T): Promise<void>;
}
