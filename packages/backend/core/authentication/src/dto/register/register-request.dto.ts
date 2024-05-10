import type { UploadedFile } from "@/backend-core/request-processor/dto";
import { IsValidFile, MatchField } from "@/backend-core/validation/validators";
import type { Optional } from "@/stacks/types";
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";
import { AuthenticationConst } from "@/backend-core/authentication/const";
import type { ISaveNewPassword } from "@/backend-core/authentication/interface";

export class RegisterRequestDto implements ISaveNewPassword {
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

	@IsValidFile({
		mimeType: "image/*",
		maxSizeInBytes: 5 * 1024 * 1024,
	})
	@IsOptional()
	public userPicture: Optional<UploadedFile>;

	@IsStrongPassword(AuthenticationConst.StrongPasswordOptions)
	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userNewPassword: string;

	@MatchField("userNewPassword")
	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userConfirmNewPassword: string;
}
