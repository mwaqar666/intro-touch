import type { CustomPlatformEntity, PlatformEntity } from "@/backend/platform/db/entities";

export class UserOwnedPlatformsResponseDto {
	public platforms: Array<PlatformEntity>;

	public customPlatforms: Array<CustomPlatformEntity>;
}
