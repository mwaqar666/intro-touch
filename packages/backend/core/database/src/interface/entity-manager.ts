import type { BaseEntity } from "@/backend-core/database/entity";
import type { IEntityRegister } from "@/backend-core/database/interface/entity-register";

export interface IEntityManager {
	registerEntities(entityRegister: IEntityRegister): void;

	resolveEntities(): Array<BaseEntity<any>>;
}
