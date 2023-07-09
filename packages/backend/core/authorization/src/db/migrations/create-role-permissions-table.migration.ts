import { AbstractMigration } from "@/backend-core/database/abstract";

export class CreateRolePermissionsTable extends AbstractMigration {
	public override timestamp = 1688817834739;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("rolePermissions", {
			rolePermissionId: this.createPrimaryKeyProps(),
			rolePermissionUuid: this.createUuidKeyProps(),
			rolePermissionRoleId: this.createForeignKeyProps(),
			rolePermissionPermissionId: this.createForeignKeyProps(),
			rolePermissionCreatedAt: this.createCreatedAtKeyProps(),
			rolePermissionUpdatedAt: this.createUpdatedAtKeyProps(),
		});

		await this.createForeignKeyConstraint("rolePermissions", "rolePermissionRoleId", "roles", "roleId");

		await this.createForeignKeyConstraint("rolePermissions", "rolePermissionPermissionId", "permissions", "permissionId");
	}

	public override async down(): Promise<void> {
		await this.dropForeignKeyConstraint("rolePermissions", "rolePermissionPermissionId");

		await this.dropForeignKeyConstraint("rolePermissions", "rolePermissionRoleId");

		await this.queryInterface.dropTable("rolePermissions");
	}
}
