import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class ListCustomPlatformRequestDto {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	public userProfileUuid: string;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	public platformCategoryUuid: string;
}
