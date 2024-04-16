import type { UserEntity } from "@/backend/user/db/entities";
import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { Permission } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import { ChangePasswordRequestDto } from "@/backend-core/authentication/dto/change-password";
import { PasswordResetTokenRequestDto } from "@/backend-core/authentication/dto/password-reset-token";
import { ResetPasswordRequestDto } from "@/backend-core/authentication/dto/reset-password";
import type { IAuthenticatable, IPasswordManager } from "@/backend-core/authentication/interface";

@Controller
export class PasswordController {
	public constructor(
		// Dependencies

		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
		@Inject(AuthenticationTokenConst.PasswordManagerToken) private readonly passwordManager: IPasswordManager,
	) {}

	public async sendPasswordResetLink(@Body(PasswordResetTokenRequestDto) passwordResetTokenRequestDto: PasswordResetTokenRequestDto): Promise<{ sent: boolean }> {
		return { sent: await this.passwordManager.sendPasswordResetToken(passwordResetTokenRequestDto) };
	}

	public async resetPassword(@Body(ResetPasswordRequestDto) resetPasswordRequestDto: ResetPasswordRequestDto): Promise<{ user: IAuthenticatable }> {
		return { user: await this.passwordManager.resetPassword(resetPasswordRequestDto) };
	}

	public async changePassword(@Auth userEntity: UserEntity, @Body(ChangePasswordRequestDto) changePasswordRequestDto: ChangePasswordRequestDto): Promise<{ user: IAuthenticatable }> {
		await this.authorization.can(userEntity, [Permission.ChangePassword]);

		return { user: await this.passwordManager.changePassword(userEntity, changePasswordRequestDto) };
	}
}
