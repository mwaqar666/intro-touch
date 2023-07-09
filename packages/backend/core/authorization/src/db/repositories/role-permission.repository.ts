import { BaseRepository } from "@/backend-core/database/repository";
import { RolePermissionEntity } from "@/backend-core/authorization/db/entities";

export class RolePermissionRepository extends BaseRepository<RolePermissionEntity> {
	public constructor() {
		super(RolePermissionEntity);
	}
}
