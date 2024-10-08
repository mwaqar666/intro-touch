import { UserRepository } from "@/backend/user/db/repositories";
import type { UploadedFile } from "@/backend-core/request-processor/dto";
import { IsStrongPassword, IsUnique, IsValidFile, MatchField } from "@/backend-core/validation/validators";
import type { Optional } from "@/stacks/types";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { ISaveNewPassword } from "@/backend-core/authentication/interface";

export class RegisterRequestDto implements ISaveNewPassword {
	@IsUnique({ repository: UserRepository })
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

	@IsStrongPassword()
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
