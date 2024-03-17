import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Transaction } from "sequelize";
import { PlatformProfileEntity } from "@/backend/platform/db/entities";
import type { CreateBuiltinPlatformRequestDto } from "@/backend/platform/dto/update-builtin-platform";

export class PlatformProfileRepository extends BaseRepository<PlatformProfileEntity> {
	public constructor() {
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

	public async createBuiltInPlatform(userProfileId: number, platformId: number, createBuiltinPlatformRequestDto: CreateBuiltinPlatformRequestDto, transaction: Transaction): Promise<PlatformProfileEntity> {
		return this.createOne({
			valuesToCreate: {
				...createBuiltinPlatformRequestDto,
				platformProfileProfileId: userProfileId,
				platformProfilePlatformId: platformId,
			},
			transaction,
		});
	}
}
