import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UserOwnedPlatformRequestDto {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	public userProfileUuid: string;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	public platformCategoryUuid: string;
}
