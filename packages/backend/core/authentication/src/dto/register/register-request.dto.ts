import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { SocialAuthRequestDto } from "@/backend-core/authentication/dto/social-auth";

export class RegisterRequestDto extends SocialAuthRequestDto {
	@MaxLength(50)
	@MinLength(8)
	@IsString()
	@IsNotEmpty()
	public userPassword: string;
}
