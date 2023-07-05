import { BaseRepository } from "@/backend-core/database/repository";
import { PlatformEntity } from "@/backend/platform/db/entities";

export class PlatformRepository extends BaseRepository<PlatformEntity> {
	public constructor() {
		super(PlatformEntity);
	}
}
