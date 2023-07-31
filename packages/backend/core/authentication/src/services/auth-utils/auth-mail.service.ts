import type { UserEntity } from "@/backend/user/db/entities";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IFrontendConfig } from "@/backend-core/config/types";
import { MailerTokenConst } from "@/backend-core/mailer/const";
import type { IMailer } from "@/backend-core/mailer/interface";
import { Inject } from "iocc";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";

export class AuthMailService {
	public constructor(
		// Dependencies

		@Inject(MailerTokenConst.MailerToken) private readonly mailer: IMailer,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async sendEmailVerificationEmailToUser(userEntity: UserEntity, verificationToken: VerificationTokenEntity): Promise<void> {
		const frontendConfig: IFrontendConfig = this.configResolver.resolveConfig("frontend");

		await this.mailer.to(userEntity.userEmail).send("send-otp.email.html", {
			name: `${userEntity.userFirstName} ${userEntity.userLastName}`,
			verificationUrl: `${frontendConfig.url}/auth/otp?email=${userEntity.userEmail}&token=${verificationToken.tokenIdentifier}`,
		});
	}
}
