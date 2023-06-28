import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	public userEmail: string;

	@IsString()
	@IsNotEmpty()
	public userPassword: string;
}
