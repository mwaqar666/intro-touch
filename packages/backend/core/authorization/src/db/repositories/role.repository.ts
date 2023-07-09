import { BaseRepository } from "@/backend-core/database/repository";
import { RoleEntity } from "@/backend-core/authorization/db/entities";

export class RoleRepository extends BaseRepository<RoleEntity> {
	public constructor() {
		super(RoleEntity);
	}
}
