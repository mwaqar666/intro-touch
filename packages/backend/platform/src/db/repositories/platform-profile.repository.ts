import { BaseRepository } from "@/backend-core/database/repository";
import { PlatformProfileEntity } from "@/backend/platform/db/entities";

export class PlatformProfileRepository extends BaseRepository<PlatformProfileEntity> {
	public constructor() {
		super(PlatformProfileEntity);
	}
}
