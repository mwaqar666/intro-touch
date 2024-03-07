import { IsUnique } from "@/backend-core/validation/validators";
import type { Optional } from "@/stacks/types";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";
import { UserProfileRepository } from "@/backend/user/db/repositories";

export class CreateUserProfileRequestDto {
	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userProfileFirstName: string;

	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public userProfileLastName: string;

	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	public userProfilePicture: string;

	@IsUnique({ repository: UserProfileRepository })
	@MaxLength(50)
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	public userProfileEmail: string;

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
