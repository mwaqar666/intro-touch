import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreatePlatformProfileRequestPathDto {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	public platformUuid: string;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	public userProfileUuid: string;
}

export class CreatePlatformProfileRequestBodyDto {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	public platformProfileIdentity: string;
}
