import type { Optional } from "@/stacks/types";
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateBuiltinPlatformRequestDto {
	@MaxLength(50)
	@IsString()
	@IsOptional()
	public platformProfileIdentity: Optional<string>;

	@IsNotEmpty()
	@IsUUID()
	public platformUuid: string;
}
