import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ResetPasswordRequestDto {
	@MaxLength(50)
	@MinLength(8)
	@IsString()
	@IsNotEmpty()
	public userPassword: string;

	@MaxLength(50)
	@MinLength(8)
	@IsString()
	@IsNotEmpty()
	public userOldPassword: string;
}
