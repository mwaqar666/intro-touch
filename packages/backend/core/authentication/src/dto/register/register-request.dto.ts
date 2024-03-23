import type { UploadedFile } from "@/backend-core/request-processor/dto";
import { IsValidFile } from "@/backend-core/validation/validators";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterRequestDto {
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
	@IsNotEmpty()
	public userPicture: UploadedFile;

	@MaxLength(50)
	@MinLength(8)
	@IsString()
	@IsNotEmpty()
	public userPassword: string;
}
