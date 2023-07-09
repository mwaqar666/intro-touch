import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreatePermissionsTable extends AbstractMigration {
	public override timestamp = 1688817815656;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("permissions", {
			permissionId: this.createPrimaryKeyProps(),
			permissionUuid: this.createUuidKeyProps(),
			permissionName: {
				allowNull: false,
				type: DataType.STRING(100),
			},
			permissionIsActive: this.createIsActiveKeyProps(),
			permissionCreatedAt: this.createCreatedAtKeyProps(),
			permissionUpdatedAt: this.createUpdatedAtKeyProps(),
			permissionDeletedAt: this.createDeletedAtKeyProps(),
		});
	}

	public override async down(): Promise<void> {
		await this.queryInterface.dropTable("permissions");
	}
}
