import type { UploadedFile } from "@/backend-core/request-processor/dto";
import { IsUnique, IsValidFile } from "@/backend-core/validation/validators";
import type { Optional } from "@/stacks/types";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UserRepository } from "@/backend/user/db/repositories";

export class UpdateUserRequestDto {
	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userFirstName: Optional<string>;

	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userLastName: Optional<string>;

	@IsValidFile({
		mimeType: "image/*",
		maxSizeInBytes: 5 * 1024 * 1024,
	})
	@IsOptional()
	public userPicture: Optional<UploadedFile>;

	@IsUnique({
		repository: UserRepository,
		extractParameterFrom: "body",
		ignoreByParameter: "userEmail",
	})
	@MaxLength(50)
	@MinLength(5)
	@IsEmail()
	@IsString()
	@IsOptional()
	public userEmail: Optional<string>;
}
