import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ShareUserAccountRequestDto {
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	public toEmail: string;
}
