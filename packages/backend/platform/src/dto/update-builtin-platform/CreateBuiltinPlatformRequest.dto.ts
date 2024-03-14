import type { Optional } from "@/stacks/types";
import { IsOptional, IsString, MaxLength } from "class-validator";
export class CreateBuiltinPlatformRequestDto {
	@MaxLength(50)
	@IsString()
	@IsOptional()
	public platformProfileIdentity: Optional<string>;
}
