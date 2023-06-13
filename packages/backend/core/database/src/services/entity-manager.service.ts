import type { BaseEntity } from "@/backend-core/database/entity";
import type { IEntityManager, IEntityRegister } from "@/backend-core/database/interface";

export class EntityManagerService implements IEntityManager {
	private readonly _entityRegister: Array<BaseEntity<any>> = [];

	public registerEntities(entityRegister: IEntityRegister): void {
		this._entityRegister.push(...entityRegister.registerEntities());
	}

	public resolveEntities(): Array<BaseEntity<any>> {
		return this._entityRegister;
	}
}
