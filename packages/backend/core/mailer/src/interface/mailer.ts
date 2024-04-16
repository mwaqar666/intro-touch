export interface IMailer {
	from(sender: string): IMailer;

	to(...recipients: Array<string>): IMailer;

	cc(...recipients: Array<string>): IMailer;

	bcc(...recipients: Array<string>): IMailer;

	send<T extends object>(emailTemplate: string, data: T): Promise<boolean>;
}
