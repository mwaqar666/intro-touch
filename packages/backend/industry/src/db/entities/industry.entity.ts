import { CreatedAtColumn, DeletedAtColumn, IsActiveColumn, PrimaryKeyColumn, StringColumn, UpdatedAtColumn, UuidKeyColumn } from "@/backend-core/database/decorators";
import { BaseEntity } from "@/backend-core/database/entity";
import { ScopeFactory } from "@/backend-core/database/scopes";
import type { Nullable } from "@/stacks/types";
import { Scopes, Table } from "sequelize-typescript";

@Scopes(() => ({
	...ScopeFactory.commonScopes(() => IndustryEntity),
}))
@Table({ tableName: "industries" })
export class IndustryEntity extends BaseEntity<IndustryEntity> {
	@PrimaryKeyColumn
	public industryId: string;

	@UuidKeyColumn
	public industryUuid: string;

	@StringColumn({ length: 100 })
	public industryName: string;

	@IsActiveColumn
	public industryIsActive: string;

	@CreatedAtColumn
	public industryCreatedAt: Date;

	@UpdatedAtColumn
	public industryUpdatedAt: Date;

	@DeletedAtColumn
	public industryDeletedAt: Nullable<Date>;
}
