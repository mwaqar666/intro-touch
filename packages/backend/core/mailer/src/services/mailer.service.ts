import { basename } from "node:path";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfig, IAppConfigResolver, IEmailConfig } from "@/backend-core/config/types";
import { EmailConst } from "@/stacks/const";
import { SendTemplatedEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { Inject } from "iocc";
import type { IMailer } from "@/backend-core/mailer/interface";
import type { ISendEmailParams } from "@/backend-core/mailer/types";

export class MailerService implements IMailer {
	private readonly sesClient: SESClient;
	private sendEmailParams: ISendEmailParams;

	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {
		this.sesClient = this.prepareSesClient();
		this.resetSendEmailParams();
	}

	public from(sender: string): IMailer {
		this.sendEmailParams.Source = sender;

		return this;
	}

	public to(...recipients: Array<string>): IMailer {
		this.sendEmailParams.Destination.ToAddresses.push(...recipients);

		return this;
	}

	public cc(...recipients: Array<string>): IMailer {
		this.sendEmailParams.Destination.CcAddresses.push(...recipients);

		return this;
	}

	public bcc(...recipients: Array<string>): IMailer {
		this.sendEmailParams.Destination.BccAddresses.push(...recipients);

		return this;
	}

	public async send<T extends object>(emailTemplate: string, data: T): Promise<boolean> {
		this.sendEmailParams.Template = this.prepareEmailTemplateName(emailTemplate);
		this.sendEmailParams.TemplateData = JSON.stringify(data);

		return this.sendEmail();
	}

	private prepareSesClient(): SESClient {
		const { region }: IAppConfig = this.configResolver.resolveConfig("app");

		return new SESClient({ region });
	}

	private resetSendEmailParams(): void {
		const { emailFrom }: IEmailConfig = this.configResolver.resolveConfig("email");

		this.sendEmailParams = {
			Destination: {
				ToAddresses: [],
				CcAddresses: [],
				BccAddresses: [],
			},
			Source: emailFrom,
			Template: "",
			TemplateData: "{}",
		};
	}

	private prepareEmailTemplateName(emailTemplate: string): string {
		const appConfig: IAppConfig = this.configResolver.resolveConfig("app");

		const templateName: string = basename(emailTemplate, ".html").replace(".", "-");

		return EmailConst.EmailId(appConfig.env, templateName);
	}

	private async sendEmail(): Promise<boolean> {
		const command: SendTemplatedEmailCommand = new SendTemplatedEmailCommand(this.sendEmailParams);

		try {
			await this.sesClient.send(command);

			this.resetSendEmailParams();

			return true;
		} catch (error) {
			this.resetSendEmailParams();

			return false;
		}
	}
}
