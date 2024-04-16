import { MatchField } from "@/backend-core/validation/validators";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import type { IChangePassword } from "@/backend-core/authentication/interface";

export class ChangePasswordRequestDto implements IChangePassword {
	@MaxLength(50)
	@MinLength(8)
	@IsString()
	@IsNotEmpty()
	public userOldPassword: string;

	@MaxLength(50)
	@MinLength(8)
	@IsString()
	@IsNotEmpty()
	public userNewPassword: string;

	@MaxLength(50)
	@MinLength(8)
	@MatchField("userNewPassword")
	@IsString()
	@IsNotEmpty()
	public userConfirmNewPassword: string;
}
