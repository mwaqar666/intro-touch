import { App } from "@/backend-core/core/extensions";
import { InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { Request } from "@/backend-core/request-processor/handlers";
import { Response } from "@/backend-core/request-processor/handlers";
import type { IResponseInterceptor } from "@/backend-core/request-processor/interface";
import type { Nullable, PossiblePromise } from "@/stacks/types";
import type { CustomPlatformEntity, PlatformEntity } from "@/backend/platform/db/entities";
import type { UserOwnedPlatformsResponseDto, UserOwnedPlatformsTransformedResponseDto, UserPlatform } from "@/backend/platform/dto/user-owned";

export class UserOwnedPlatformResponseInterceptor implements IResponseInterceptor<Request, Response<UserOwnedPlatformsResponseDto>, Response<UserOwnedPlatformsTransformedResponseDto>> {
	public intercept(_request: Request, response: Response<UserOwnedPlatformsResponseDto>): PossiblePromise<Response<UserOwnedPlatformsTransformedResponseDto>> {
		const userOwnedPlatforms: Nullable<UserOwnedPlatformsResponseDto> = response.getData();

		if (!userOwnedPlatforms) throw new InternalServerException();

		const userBuiltInPlatforms: Array<UserPlatform> = userOwnedPlatforms.platforms.map((platform: PlatformEntity): UserPlatform => {
			return {
				platformUuid: platform.platformUuid,
				platformName: platform.platformName,
				platformIcon: platform.platformIcon,
				platformIsActive: platform.platformIsActive,
				platformIdentity: platform.platformPlatformProfile.platformProfileIdentity,
			};
		});

		const userCustomPlatforms: Array<UserPlatform> = userOwnedPlatforms.customPlatforms.map((platform: CustomPlatformEntity): UserPlatform => {
			return {
				platformUuid: platform.customPlatformUuid,
				platformName: platform.customPlatformName,
				platformIcon: platform.customPlatformIcon,
				platformIsActive: platform.customPlatformIsActive,
				platformIdentity: platform.customPlatformIdentity,
			};
		});

		const platforms: Array<UserPlatform> = [...userBuiltInPlatforms, ...userCustomPlatforms];

		const transformedResponse: Response<UserOwnedPlatformsTransformedResponseDto> = App.container.resolve(Response<UserOwnedPlatformsTransformedResponseDto>);

		return transformedResponse.handle(response).setData({ platforms });
	}
}
