import type { Optional } from "@/stacks/types";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateCustomPlatformRequestDto {
	@MaxLength(50)
	@IsString()
	@IsOptional()
	public customPlatformName: Optional<string>;

	@MaxLength(255)
	@IsString()
	@IsOptional()
	public customPlatformIcon: Optional<string>;

	@MaxLength(255)
	@IsString()
	@IsOptional()
	public customPlatformIdentity: Optional<string>;
}
