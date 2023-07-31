import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class SocialAuthRequestDto {
	@MaxLength(50)
	@MinLength(5)
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	public userEmail: string;

	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userFirstName: string;

	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userLastName: string;

	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userPicture: string;
}
