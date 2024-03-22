import type { UploadedFile } from "@/backend-core/request-processor/dto";
import { IsValidFile } from "@/backend-core/validation/validators";
import type { Optional } from "@/stacks/types";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateBuiltinPlatformRequestDto {
	@MaxLength(50)
	@IsString()
	@IsOptional()
	public platformName: Optional<string>;

	@IsValidFile({
		mimeType: "image/*",
		maxSizeInBytes: 5 * 1024 * 1024,
		existing: true,
	})
	@IsOptional()
	public platformIcon: Optional<string | UploadedFile>;
}
