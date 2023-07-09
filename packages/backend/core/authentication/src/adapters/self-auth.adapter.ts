import type { UserEntity } from "@/backend/user/db/entities";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import { BadRequestException, InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { IResponseHandler } from "@/backend-core/request-processor/interface";
import type { IControllerResponse } from "@/backend-core/request-processor/types";
import { ValidationTokenConst } from "@/backend-core/validation/const";
import type { IValidator } from "@/backend-core/validation/interface";
import type { ApiResponse, IAnyObject, Nullable, Optional } from "@/stacks/types";
import { Inject } from "iocc";
import { useBody, usePath } from "sst/node/api";
import { createAdapter, Session } from "sst/node/auth";
import { LoginRequestDto } from "@/backend-core/authentication/dto/login";
import { RegisterRequestDto } from "@/backend-core/authentication/dto/register";
import { ResendRequestDto } from "@/backend-core/authentication/dto/resend";
import { VerifyRequestDto } from "@/backend-core/authentication/dto/verify";
import { InvalidCredentialsException } from "@/backend-core/authentication/exceptions";
import type { IAuthAdapter } from "@/backend-core/authentication/interface";
import { AdapterService } from "@/backend-core/authentication/services/adapter";
import type { IAuthAdapterRecord } from "@/backend-core/authentication/types";

export class SelfAuthAdapter implements IAuthAdapter {
	public constructor(
		// Dependencies
		@Inject(AdapterService) private readonly adapterService: AdapterService,
		@Inject(ValidationTokenConst.ValidatorToken) private readonly validator: IValidator,
		@Inject(RequestProcessorTokenConst.ResponseHandlerToken) private readonly responseHandler: IResponseHandler,
	) {}

	public configureAuthAdapter(): IAuthAdapterRecord {
		const selfAuthAdapter = createAdapter(() => {
			return async (): Promise<ApiResponse> => {
				let response: IControllerResponse<{ token: Nullable<string> }>;

				try {
					const form: IAnyObject = this.retrieveRequestData();
					const [step]: Array<string> = usePath().slice(-1);

					let user: Nullable<UserEntity> = null;

					if (step === "register") await this.runRegisterFlow(form);
					else if (step === "login") user = await this.runLoginFlow(form);
					else if (step === "verify") user = await this.runVerificationFlow(form);
					else if (step === "resend") await this.runResendVerificationFlow(form);
					else throw new InternalServerException("Invalid auth route");

					response = this.responseHandler.createSuccessfulResponse({
						token: user ? this.createAuthToken(user) : null,
					});
				} catch (exception) {
					response = this.responseHandler.handleException(exception);
				}

				return {
					...response,
					body: JSON.stringify(response.body),
				};
			};
		});

		return {
			adapter: selfAuthAdapter(),
			identifier: "self",
		};
	}

	private retrieveRequestData(): IAnyObject {
		const body: Optional<string> = useBody();

		if (!body) throw new BadRequestException();

		return JSON.parse(body);
	}

	private async runRegisterFlow(registerRequestBody: IAnyObject): Promise<void> {
		const registerRequestDto: RegisterRequestDto = await this.validator.validate(RegisterRequestDto, registerRequestBody);

		const user: UserEntity = await this.adapterService.createUserInDatabase(registerRequestDto);

		await this.adapterService.sendEmailVerificationEmailToUser(user);
	}

	private async runLoginFlow(loginRequestBody: IAnyObject): Promise<UserEntity> {
		const { userEmail, userPassword }: LoginRequestDto = await this.validator.validate(LoginRequestDto, loginRequestBody);

		const user: Nullable<UserEntity> = await this.adapterService.findUserInDatabaseByEmail(userEmail);
		if (!user) throw new InvalidCredentialsException();

		const passwordVerified: boolean = await user.verifyPassword(userPassword);
		if (!passwordVerified) throw new InvalidCredentialsException();

		const userIsVerified: boolean = await this.adapterService.verifyUserEmailIsVerified(user);
		if (!userIsVerified) throw new InvalidCredentialsException();

		return user;
	}

	private async runVerificationFlow(verificationRequestBody: IAnyObject): Promise<UserEntity> {
		const { userEmail, tokenIdentifier }: VerifyRequestDto = await this.validator.validate(VerifyRequestDto, verificationRequestBody);

		const user: Nullable<UserEntity> = await this.adapterService.findUserInDatabaseByEmail(userEmail);
		if (!user) throw new InvalidCredentialsException();

		const userVerified: boolean = await this.adapterService.verifyUserEmailVerificationToken(user, tokenIdentifier);
		if (!userVerified) throw new InvalidCredentialsException();

		return user;
	}

	private async runResendVerificationFlow(verificationRequestBody: IAnyObject): Promise<void> {
		const { userEmail }: ResendRequestDto = await this.validator.validate(ResendRequestDto, verificationRequestBody);

		const user: Nullable<UserEntity> = await this.adapterService.findUserInDatabaseByEmail(userEmail);
		if (!user) throw new InvalidCredentialsException();

		await this.adapterService.sendEmailVerificationEmailToUser(user);
	}

	private createAuthToken(user: UserEntity): string {
		return Session.create({
			type: "user",
			properties: this.adapterService.createAuthPayload(user),
			options: this.adapterService.createTokenProps(user),
		});
	}
}
