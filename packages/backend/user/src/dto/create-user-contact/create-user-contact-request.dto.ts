import type { UploadedFile } from "@/backend-core/request-processor/dto";
import { IsValidFile } from "@/backend-core/validation/validators";
import type { Optional } from "@/stacks/types";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateUserContactRequestDto {
	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userContactFirstName: string;

	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userContactLastName: string;

	@IsValidFile({
		maxSizeInBytes: 5 * 1024 * 1024,
		mimeType: "image/*",
	})
	@IsOptional()
	public userContactPicture: Optional<UploadedFile>;

	@MaxLength(50)
	@IsEmail()
	@IsString()
	@IsOptional()
	public userContactEmail: Optional<string>;

	@IsString()
	@IsOptional()
	public userContactNote: Optional<string>;

	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userContactPhone: Optional<string>;
}
