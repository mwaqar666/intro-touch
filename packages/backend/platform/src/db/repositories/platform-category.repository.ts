import { BaseRepository } from "@/backend-core/database/repository";
import { PlatformCategoryEntity } from "@/backend/platform/db/entities";

export class PlatformCategoryRepository extends BaseRepository<PlatformCategoryEntity> {
	public constructor() {
		super(PlatformCategoryEntity);
	}
}
