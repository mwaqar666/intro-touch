import type { UploadedFile } from "@/backend-core/request-processor/dto";
import { IsValidFile } from "@/backend-core/validation/validators";
import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateCustomPlatformRequestPathDto {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	public userProfileUuid: string;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	public platformCategoryUuid: string;
}

export class CreateCustomPlatformRequestBodyDto {
	@MaxLength(100)
	@IsString()
	@IsNotEmpty()
	public customPlatformName: string;

	@IsValidFile({
		mimeType: "image/*",
		maxSizeInBytes: 5 * 1024 * 1024,
	})
	@IsNotEmpty()
	public customPlatformIcon: UploadedFile;

	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	public customPlatformIdentity: string;
}
