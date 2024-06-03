import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IFrontendConfig } from "@/backend-core/config/types";
import { MailerTokenConst } from "@/backend-core/mailer/const";
import type { IMailer } from "@/backend-core/mailer/interface";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";

export class UserEmailService {
	public constructor(
		// Dependencies

		@Inject(MailerTokenConst.MailerToken) private readonly mailer: IMailer,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async sendAccountShareEmail(userEntity: UserEntity, toEmail: string): Promise<boolean> {
		const frontendConfig: IFrontendConfig = this.configResolver.resolveConfig("frontend");

		return this.mailer.to(toEmail).send("share-profile.email.html", {
			name: `${userEntity.userFirstName} ${userEntity.userLastName}`,
			profileLink: `${frontendConfig.url}/profile/${userEntity.userUsername}`,
		});
	}
}
