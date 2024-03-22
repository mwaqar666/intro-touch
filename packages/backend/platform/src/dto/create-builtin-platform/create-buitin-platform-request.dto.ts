import type { UploadedFile } from "@/backend-core/request-processor/dto";
import { IsValidFile } from "@/backend-core/validation/validators";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateBuiltinPlatformRequestDto {
	@MaxLength(50)
	@IsString()
	@IsNotEmpty()
	public platformName: string;

	@IsValidFile({
		mimeType: "image/*",
		maxSizeInBytes: 5 * 1024 * 1024,
	})
	@IsNotEmpty()
	public platformIcon: UploadedFile;
}
