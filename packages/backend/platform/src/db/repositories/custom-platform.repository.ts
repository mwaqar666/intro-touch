import { BaseRepository } from "@/backend-core/database/repository";
import { CustomPlatformEntity } from "@/backend/platform/db/entities";

export class CustomPlatformRepository extends BaseRepository<CustomPlatformEntity> {
	public constructor() {
		super(CustomPlatformEntity);
	}
}
