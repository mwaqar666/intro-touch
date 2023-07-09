import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyRequestDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	public userEmail: string;

	@IsString()
	@IsNotEmpty()
	public tokenIdentifier: string;
}
