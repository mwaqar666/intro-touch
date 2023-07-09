import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ResendRequestDto {
	@MaxLength(50)
	@MinLength(5)
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	public userEmail: string;
}
