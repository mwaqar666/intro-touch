import type { Optional } from "@/stacks/types";
import { IsBoolean, IsEmail, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdateUserProfileRequestDto {
	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userProfileFirstName: Optional<string>;

	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userProfileLastName: Optional<string>;

	@MaxLength(255)
	@IsString()
	@IsOptional()
	public userProfilePicture: Optional<string>;

	@MaxLength(50)
	@IsEmail()
	@IsString()
	@IsOptional()
	public userProfileEmail: Optional<string>;

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
	public userProfileFax: Optional<string>;

	@MaxLength(255)
	@IsUrl()
	@IsOptional()
	public userProfileWebsite: Optional<string>;

	@IsBoolean()
	@IsOptional()
	public userProfileIsLive: Optional<boolean>;

	@IsBoolean()
	@IsOptional()
	public userProfileIsActive: Optional<boolean>;
}
