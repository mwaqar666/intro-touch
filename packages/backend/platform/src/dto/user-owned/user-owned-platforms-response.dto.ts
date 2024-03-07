import type { CustomPlatformEntity, PlatformEntity } from "@/backend/platform/db/entities";

export class UserOwnedPlatformsResponseDto {
	public platforms: Array<PlatformEntity>;

	public customPlatforms: Array<CustomPlatformEntity>;
}

export class UserOwnedPlatformsTransformedResponseDto {
	public platforms: Array<UserBuiltInPlatform | UserCustomPlatform>;
}

export class UserPlatform {
	public platformUuid: string;
	public platformName: string;
	public platformIcon: string;
	public platformIdentity: string;
	public platformIsActive: boolean;
}

export class UserBuiltInPlatform extends UserPlatform {
	public platformType: "builtIn";
}

export class UserCustomPlatform extends UserPlatform {
	public platformType: "custom";
}
