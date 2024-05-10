import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import type { ISendPasswordResetToken } from "@/backend-core/authentication/interface";

export class PasswordResetTokenRequestDto implements ISendPasswordResetToken {
	@IsEmail()
	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userEmail: string;
}
