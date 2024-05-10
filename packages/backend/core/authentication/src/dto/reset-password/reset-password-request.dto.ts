import { MatchField } from "@/backend-core/validation/validators";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsUUID, MaxLength } from "class-validator";
import { AuthenticationConst } from "@/backend-core/authentication/const";
import type { IResetPassword } from "@/backend-core/authentication/interface";

export class ResetPasswordRequestDto implements IResetPassword {
	@IsEmail()
	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userEmail: string;

	@IsUUID()
	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public tokenIdentifier: string;

	@IsStrongPassword(AuthenticationConst.StrongPasswordOptions)
	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userNewPassword: string;

	@MatchField("userNewPassword")
	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userConfirmNewPassword: string;
}
