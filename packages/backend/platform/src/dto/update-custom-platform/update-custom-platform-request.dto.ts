import type { UploadedFile } from "@/backend-core/request-processor/dto";
import { IsValidFile } from "@/backend-core/validation/validators";
import type { Optional } from "@/stacks/types";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateCustomPlatformRequestDto {
	@MaxLength(100)
	@IsString()
	@IsOptional()
	public customPlatformName: Optional<string>;

	@IsValidFile({
		mimeType: "image/*",
		maxSizeInBytes: 5 * 1024 * 1024,
		existing: true,
	})
	@IsOptional()
	public customPlatformIcon: Optional<string | UploadedFile>;

	@MaxLength(255)
	@IsString()
	@IsOptional()
	public customPlatformIdentity: Optional<string>;
}
