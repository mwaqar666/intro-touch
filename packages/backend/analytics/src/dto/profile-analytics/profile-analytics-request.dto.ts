import type { Optional } from "@/stacks/types";
import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { AnalyticsConst } from "@/backend/analytics/const";
import type { TAnalyticsDuration } from "@/backend/analytics/types";

export class ProfileAnalyticsRequestPathDto {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	public userProfileUuid: string;
}

export class ProfileAnalyticsRequestQueryDto {
	@IsIn(AnalyticsConst.ValidAnalyticsDuration)
	@IsString()
	@IsOptional()
	public duration: Optional<TAnalyticsDuration>;
}
