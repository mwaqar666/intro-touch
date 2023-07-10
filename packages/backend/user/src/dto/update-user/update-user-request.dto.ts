import type { Optional } from "@/stacks/types";
import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUserRequestDto {
	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userFirstName: Optional<string>;

	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userLastName: Optional<string>;

	@MaxLength(255)
	@IsString()
	@IsOptional()
	public userPicture: Optional<string>;

	@MaxLength(50)
	@IsEmail()
	@IsString()
	@IsOptional()
	public userEmail: Optional<string>;

	@IsBoolean()
	@IsOptional()
	public userIsActive: Optional<boolean>;
}
