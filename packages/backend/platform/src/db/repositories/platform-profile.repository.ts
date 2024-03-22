import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Transaction } from "sequelize";
import { PlatformProfileEntity } from "@/backend/platform/db/entities";

export class PlatformProfileRepository extends BaseRepository<PlatformProfileEntity> {
	public constructor() {
		super(PlatformProfileEntity);
	}

	public createPlatformProfile(valuesToCreate: Partial<IEntityTableColumnProperties<PlatformProfileEntity>>, transaction: Transaction): Promise<PlatformProfileEntity> {
		return this.createOne({
			valuesToCreate,
			transaction,
		});
	}

	public updatePlatformProfile(platformProfileUuid: string, valuesToUpdate: Partial<IEntityTableColumnProperties<PlatformProfileEntity>>, transaction: Transaction): Promise<PlatformProfileEntity> {
		return this.updateOne({
			entity: platformProfileUuid,
			valuesToUpdate,
			transaction,
		});
	}

	public deletePlatformProfile(platformProfileUuid: string, transaction: Transaction): Promise<boolean> {
		return this.deleteOne({
			entity: platformProfileUuid,
			transaction,
		});
	}
}
