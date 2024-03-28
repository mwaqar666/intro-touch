import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateIndustryRequestDto {
	@MaxLength(100)
	@IsString()
	@IsNotEmpty()
	public industryName: string;
}
