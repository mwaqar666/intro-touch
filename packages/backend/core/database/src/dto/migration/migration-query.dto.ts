import type { Optional } from "@/stacks/types";
import { IsNumber, IsOptional } from "class-validator";

export class MigrationQueryDto {
	@IsNumber()
	@IsOptional()
	public step: Optional<number>;
}
