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

	@MaxLength(50)
	@IsEmail()
	@IsString()
	public userContactEmail: string;

	@IsString()
	@IsOptional()
	public userContactNote: Optional<string>;

	@MaxLength(50)
	@IsString()
	@IsOptional()
	public userContactPhone: Optional<string>;
}
