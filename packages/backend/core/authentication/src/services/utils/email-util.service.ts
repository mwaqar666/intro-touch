import type { UserEntity } from "@/backend/user/db/entities";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IFrontendConfig } from "@/backend-core/config/types";
import { MailerTokenConst } from "@/backend-core/mailer/const";
import type { IMailer } from "@/backend-core/mailer/interface";
import { Inject } from "iocc";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";

export class EmailUtilService {
	public constructor(
		// Dependencies

		@Inject(MailerTokenConst.MailerToken) private readonly mailer: IMailer,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async sendAccountVerificationEmailToUser(userEntity: UserEntity, verificationToken: VerificationTokenEntity): Promise<boolean> {
		const frontendConfig: IFrontendConfig = this.configResolver.resolveConfig("frontend");

		return this.mailer.to(userEntity.userEmail).send("verify-email.email.html", {
			name: `${userEntity.userFirstName} ${userEntity.userLastName}`,
			verificationUrl: `${frontendConfig.url}/email/verify?email=${userEntity.userEmail}&token=${verificationToken.tokenIdentifier}`,
		});
	}

	public async sendPasswordResetEmailToUser(userEntity: UserEntity, verificationToken: VerificationTokenEntity): Promise<boolean> {
		const frontendConfig: IFrontendConfig = this.configResolver.resolveConfig("frontend");

		return this.mailer.to(userEntity.userEmail).send("reset-password.email.html", {
			name: `${userEntity.userFirstName} ${userEntity.userLastName}`,
			verificationUrl: `${frontendConfig.url}/password/reset?email=${userEntity.userEmail}&token=${verificationToken.tokenIdentifier}`,
		});
	}
}
