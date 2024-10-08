import { App } from "@/backend-core/core/extensions";
import { InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { Request } from "@/backend-core/request-processor/handlers";
import { Response } from "@/backend-core/request-processor/handlers";
import type { IResponseInterceptor } from "@/backend-core/request-processor/interface";
import type { Nullable, PossiblePromise } from "@/stacks/types";
import type { CustomPlatformEntity, PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import type { UserBuiltInPlatform, UserCustomPlatform, UserOwnedPlatformResponseDto, UserOwnedPlatformTransformedResponseDto, UserPlatform } from "@/backend/platform/dto/user-owned";

export class UserOwnedPlatformResponseInterceptor implements IResponseInterceptor<Request, Response<UserOwnedPlatformResponseDto>, Response<UserOwnedPlatformTransformedResponseDto>> {
	public intercept(_: Request, response: Response<UserOwnedPlatformResponseDto>): PossiblePromise<Response<UserOwnedPlatformTransformedResponseDto>> {
		const userOwnedPlatforms: Nullable<UserOwnedPlatformResponseDto> = response.getData();

		if (!userOwnedPlatforms) throw new InternalServerException();

		const userBuiltInPlatforms: Array<UserBuiltInPlatform> = userOwnedPlatforms.platforms.flatMap((platform: PlatformEntity): Array<UserBuiltInPlatform> => {
			return platform.platformPlatformProfiles.map((platformProfile: PlatformProfileEntity): UserBuiltInPlatform => {
				return {
					platformType: "builtIn",
					platformUuid: platform.platformUuid,
					platformName: platform.platformName,
					platformIcon: platform.platformIcon,
					platformIsActive: platform.platformIsActive,
					platformProfileUuid: platformProfile.platformProfileUuid,
					platformProfileIdentity: platformProfile.platformProfileIdentity,
					platformProfileIsActive: platformProfile.platformProfileIsActive,
				};
			});
		});

		const userCustomPlatforms: Array<UserCustomPlatform> = userOwnedPlatforms.customPlatforms.map((platform: CustomPlatformEntity): UserCustomPlatform => {
			return {
				platformType: "custom",
				platformUuid: platform.customPlatformUuid,
				platformName: platform.customPlatformName,
				platformIcon: platform.customPlatformIcon,
				platformIsActive: platform.customPlatformIsActive,
				platformProfileUuid: platform.customPlatformUuid,
				platformProfileIdentity: platform.customPlatformIdentity,
				platformProfileIsActive: platform.customPlatformIsActive,
			};
		});

		const platforms: Array<UserPlatform> = [...userBuiltInPlatforms, ...userCustomPlatforms];

		const transformedResponse: Response<UserOwnedPlatformTransformedResponseDto> = App.container.resolve(Response<UserOwnedPlatformTransformedResponseDto>);

		return transformedResponse.handle(response).setData({ platforms });
	}
}
