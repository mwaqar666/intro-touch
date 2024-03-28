import type { Optional } from "@/stacks/types";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateIndustryRequestDto {
	@MaxLength(100)
	@IsString()
	@IsOptional()
	public industryName: Optional<string>;
}
