import type { CustomPlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";

export class ProfileAnalyticsResponseDto {
	public platformVisits: Array<PlatformProfileEntity>;
	public customPlatformVisits: Array<CustomPlatformEntity>;
}

export class ProfileAnalyticsTransformedResponseDto {
	public analytics: Array<PlatformAnalytics>;
}

export class BasePlatformAnalytics {
	public platformUuid: string;
	public platformName: string;
	public platformIcon: string;
	public platformVisits: number;
	public platformProfileUuid: string;
	public platformProfileIdentity: string;
}

export class BuiltinPlatformAnalytics extends BasePlatformAnalytics {
	public platformType: "builtIn";
}

export class CustomPlatformAnalytics extends BasePlatformAnalytics {
	public platformType: "custom";
}

export type PlatformAnalytics = BuiltinPlatformAnalytics | CustomPlatformAnalytics;
