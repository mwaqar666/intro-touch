import type { CustomPlatformEntity, PlatformEntity } from "@/backend/platform/db/entities";

export class UserOwnedPlatformResponseDto {
	public platforms: Array<PlatformEntity>;

	public customPlatforms: Array<CustomPlatformEntity>;
}

export class UserOwnedPlatformTransformedResponseDto {
	public platforms: Array<UserPlatform>;
}

export class UserBasePlatform {
	public platformUuid: string;
	public platformName: string;
	public platformIcon: string;
	public platformIsActive: boolean;
	public platformProfileUuid: string;
	public platformProfileIdentity: string;
	public platformProfileIsActive: boolean;
}

export class UserBuiltInPlatform extends UserBasePlatform {
	public platformType: "builtIn";
}

export class UserCustomPlatform extends UserBasePlatform {
	public platformType: "custom";
}

export type UserPlatform = UserBuiltInPlatform | UserCustomPlatform;
