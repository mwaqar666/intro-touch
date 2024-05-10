import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyEmailRequestDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	public userEmail: string;

	@IsString()
	@IsNotEmpty()
	public tokenIdentifier: string;
}
