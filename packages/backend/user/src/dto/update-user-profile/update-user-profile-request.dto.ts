import type { UploadedFile } from "@/backend-core/request-processor/dto";
import { IsUnique, IsValidFile } from "@/backend-core/validation/validators";
import type { Optional } from "@/stacks/types";
import { IsBoolean, IsEmail, IsOptional, IsString, IsUrl, IsUUID, MaxLength } from "class-validator";
import { UserProfileRepository } from "@/backend/user/db/repositories";

export class UpdateUserProfileRequestDto {
	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userProfileFirstName: Optional<string>;

	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userProfileLastName: Optional<string>;

	@IsValidFile({
		existing: true,
		mimeType: "image/*",
		maxSizeInBytes: 5 * 1024 * 1024,
	})
	@IsOptional()
	public userProfilePicture: Optional<string | UploadedFile>;

	@IsUnique({
		repository: UserProfileRepository,
		extractParameterFrom: "path",
		ignoreByParameter: "userProfileUuid",
	})
	@MaxLength(50)
	@IsEmail()
	@IsString()
	@IsOptional()
	public userProfileEmail: Optional<string>;

	@IsUUID()
	@IsOptional()
	public userProfileIndustryUuid: Optional<string>;

	@IsString()
	@IsOptional()
	public userProfileBio: Optional<string>;

	@MaxLength(255)
	@IsString()
	@IsOptional()
	public userProfileCompany: Optional<string>;

	@MaxLength(255)
	@IsString()
	@IsOptional()
	public userProfileJobTitle: Optional<string>;

	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userProfileWorkplacePhone: Optional<string>;

	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userProfilePersonalPhone: Optional<string>;

	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userProfileLandPhone: Optional<string>;

	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userProfileFax: Optional<string>;

	@MaxLength(255)
	@IsUrl()
	@IsOptional()
	public userProfileWebsite: Optional<string>;

	@IsBoolean()
	@IsOptional()
	public userProfileIsActive: Optional<boolean>;
}
