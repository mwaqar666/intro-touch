import type { BaseEntity } from "@/backend-core/database/entity";

export interface IEntityRegister {
	registerEntities(): Array<BaseEntity<any>>;
}
