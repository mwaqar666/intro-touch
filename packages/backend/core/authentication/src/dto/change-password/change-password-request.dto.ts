import { MatchField } from "@/backend-core/validation/validators";
import { IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";
import { AuthenticationConst } from "@/backend-core/authentication/const";
import type { IChangePassword } from "@/backend-core/authentication/interface";

export class ChangePasswordRequestDto implements IChangePassword {
	@MaxLength(50)
	@MinLength(8)
	@IsString()
	@IsNotEmpty()
	public userOldPassword: string;

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
