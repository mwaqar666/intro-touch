import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import type { IFindOrCreateUserProps } from "@/backend/user/types";
import { Inject } from "iocc";
import type { RegisterRequestDto } from "@/backend-core/authentication/dto/register";

export class SignUpService {
	public constructor(
		// Dependencies
		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		// @Inject(EmailUtilService) private readonly emailUtilService: EmailUtilService,
		// @Inject(VerificationTokenService) private readonly verificationTokenService: VerificationTokenService,
	) {}

	public async basicRegister(registerRequestDto: RegisterRequestDto): Promise<boolean> {
		const findOrCreateUserProps: IFindOrCreateUserProps = { ...registerRequestDto, userParentId: 1 };

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const user: UserEntity = await this.userAuthService.createNewUserWithProfile(findOrCreateUserProps);

		// const verificationToken: VerificationTokenEntity = await this.verificationTokenService.createEmailVerificationToken(user);
		//
		// await this.emailUtilService.sendAccountVerificationEmailToUser(user, verificationToken);

		return true;
	}
}
