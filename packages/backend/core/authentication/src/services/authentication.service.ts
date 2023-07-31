import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import type { IFindOrCreateUserProps } from "@/backend/user/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import type { LoginRequestDto } from "@/backend-core/authentication/dto/login";
import type { RegisterRequestDto } from "@/backend-core/authentication/dto/register";
import type { ResendRequestDto } from "@/backend-core/authentication/dto/resend";
import type { VerifyRequestDto } from "@/backend-core/authentication/dto/verify";
import { InvalidCredentialsException } from "@/backend-core/authentication/exceptions";
import { AuthMailService, AuthTokenService } from "@/backend-core/authentication/services/auth-utils";
import { VerificationTokenService } from "@/backend-core/authentication/services/verification-token.service";

export class AuthenticationService {
	public constructor(
		// Dependencies

		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		@Inject(AuthMailService) private readonly authMailService: AuthMailService,
		@Inject(AuthTokenService) private readonly authTokenService: AuthTokenService,
		@Inject(VerificationTokenService) private readonly verificationTokenService: VerificationTokenService,
	) {}

	public async basicLogin(loginRequestDto: LoginRequestDto): Promise<string> {
		const user: Nullable<UserEntity> = await this.userAuthService.findActiveUserByEmail(loginRequestDto.userEmail);
		if (!user) throw new InvalidCredentialsException();

		const passwordVerified: boolean = await user.verifyPassword(loginRequestDto.userPassword);
		if (!passwordVerified) throw new InvalidCredentialsException();

		const userIsVerified: boolean = await this.verificationTokenService.verifyUserEmailIsVerified(user);
		if (!userIsVerified) throw new InvalidCredentialsException();

		return this.authTokenService.createAuthenticationToken(user);
	}

	public async basicRegister(registerRequestDto: RegisterRequestDto): Promise<boolean> {
		const user: UserEntity = await this.userAuthService.createNewUserWithProfile(registerRequestDto);

		const verificationToken: VerificationTokenEntity = await this.verificationTokenService.createEmailVerificationToken(user);

		await this.authMailService.sendEmailVerificationEmailToUser(user, verificationToken);

		return true;
	}

	public async verifyRegisteredEmail(verifyRequestDto: VerifyRequestDto): Promise<string> {
		const user: Nullable<UserEntity> = await this.userAuthService.findActiveUserByEmail(verifyRequestDto.userEmail);
		if (!user) throw new InvalidCredentialsException();

		const userVerified: boolean = await this.verificationTokenService.verifyUserEmailVerificationToken(user, verifyRequestDto.tokenIdentifier);
		if (!userVerified) throw new InvalidCredentialsException();

		return this.authTokenService.createAuthenticationToken(user);
	}

	public async resendEmailVerificationToken(resendRequestDto: ResendRequestDto): Promise<boolean> {
		const user: Nullable<UserEntity> = await this.userAuthService.findActiveUserByEmail(resendRequestDto.userEmail);
		if (!user) throw new InvalidCredentialsException();

		const verificationToken: VerificationTokenEntity = await this.verificationTokenService.createEmailVerificationToken(user);

		await this.authMailService.sendEmailVerificationEmailToUser(user, verificationToken);

		return true;
	}

	public async findOrCreateUser(findOrCreateUserProps: IFindOrCreateUserProps): Promise<[UserEntity, boolean]> {
		let created = true;

		let entity: Nullable<UserEntity> = await this.userAuthService.findActiveUserByEmail(findOrCreateUserProps.userEmail);

		if (entity) created = false;
		else entity = await this.userAuthService.createNewUserWithProfile(findOrCreateUserProps);

		return [entity, created];
	}
}
