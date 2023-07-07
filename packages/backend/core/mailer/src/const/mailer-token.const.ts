import { Token } from "iocc";
import type { IMailer } from "@/backend-core/mailer/interface";

export class MailerTokenConst {
	public static readonly MailerToken: Token<IMailer> = new Token<IMailer>("Mailer");
}
