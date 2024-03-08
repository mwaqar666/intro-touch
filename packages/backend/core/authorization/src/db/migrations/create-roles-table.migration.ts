import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreateRolesTable extends AbstractMigration {
	public override timestamp = 1688817783332;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("roles", {
			roleId: this.createPrimaryKeyProps(),
			roleUuid: this.createUuidKeyProps(),
			roleParentId: this.createForeignKeyProps(true),
			roleName: {
				allowNull: false,
				type: DataType.STRING(100),
			},
			roleIsActive: this.createIsActiveKeyProps(),
			roleCreatedAt: this.createCreatedAtKeyProps(),
			roleUpdatedAt: this.createUpdatedAtKeyProps(),
			roleDeletedAt: this.createDeletedAtKeyProps(),
		});

		await this.createForeignKeyConstraint("roles", "roleParentId", "roles", "roleId");
	}

	public override async down(): Promise<void> {
		await this.dropForeignKeyConstraint("roles", "roleParentId");

		await this.queryInterface.dropTable("roles");
	}
}
