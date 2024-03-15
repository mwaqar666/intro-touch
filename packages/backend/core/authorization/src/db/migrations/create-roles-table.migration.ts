import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreateRolesTable extends AbstractMigration {
	public override timestamp = 1688817783332;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("roles", {
			roleId: this.createPrimaryKeyProps(),
			roleUuid: this.createUuidKeyProps(),
			roleName: {
				allowNull: false,
				type: DataType.STRING(100),
			},
			roleIsActive: this.createIsActiveKeyProps(),
			roleCreatedAt: this.createCreatedAtKeyProps(),
			roleUpdatedAt: this.createUpdatedAtKeyProps(),
			roleDeletedAt: this.createDeletedAtKeyProps(),
		});
	}

	public override async down(): Promise<void> {
		await this.queryInterface.dropTable("roles");
	}
}
