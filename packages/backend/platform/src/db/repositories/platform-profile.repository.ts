import type { UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileService } from "@/backend/user/services";
import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { Transaction } from "sequelize";
import { type PlatformEntity, PlatformProfileEntity } from "@/backend/platform/db/entities";
import type { CreateBuiltinPlatformRequestDto } from "@/backend/platform/dto/update-builtin-platform";
import { PlatformService } from "@/backend/platform/services";

export class PlatformProfileRepository extends BaseRepository<PlatformProfileEntity> {
	public constructor(
		// Dependencies

		@Inject(PlatformService) private readonly platformService: PlatformService,
		@Inject(UserProfileService) private readonly userProfileService: UserProfileService,
	) {
		super(PlatformProfileEntity);
	}

	public updateBuiltInPlatform(platformProfileUuid: string, valuesToUpdate: Partial<IEntityTableColumnProperties<PlatformProfileEntity>>, transaction: Transaction): Promise<PlatformProfileEntity> {
		return this.updateOne({
			findOptions: {
				where: { platformProfileUuid },
			},
			valuesToUpdate,
			transaction,
		});
	}

	public async createBuiltInPlatform(userProfileUuid: string, platformUuid: string, createBuiltinPlatformRequestDto: CreateBuiltinPlatformRequestDto, transaction: Transaction): Promise<PlatformProfileEntity> {
		const userProfile: UserProfileEntity = await this.userProfileService.getUserProfile(userProfileUuid);

		const platform: PlatformEntity = await this.platformService.fetchPlatform(platformUuid);

		return this.createOne({
			valuesToCreate: {
				...createBuiltinPlatformRequestDto,
				platformProfileProfileId: userProfile.userProfileId,
				platformProfilePlatformId: platform.platformId,
			},
			transaction,
		});
	}
}
