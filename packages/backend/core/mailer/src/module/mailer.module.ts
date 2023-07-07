import { AbstractModule } from "@/backend-core/core/concrete/module";
import { MailerTokenConst } from "@/backend-core/mailer/const";
import { MailerService } from "@/backend-core/mailer/services";

export class MailerModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(MailerTokenConst.MailerToken, MailerService);
	}
}
