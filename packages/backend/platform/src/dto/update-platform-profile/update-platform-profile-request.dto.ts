import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdatePlatformProfileRequestDto {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	public platformProfileIdentity: string;
}
