import { AbstractMigration } from "@/backend-core/database/abstract";

export class CreateUserRolesTable extends AbstractMigration {
	public override timestamp = 1688817862430;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("userRoles", {
			userRoleId: this.createPrimaryKeyProps(),
			userRoleUuid: this.createUuidKeyProps(),
			userRoleRoleId: this.createForeignKeyProps(),
			userRoleUserId: this.createForeignKeyProps(),
			userRoleCreatedAt: this.createCreatedAtKeyProps(),
			userRoleUpdatedAt: this.createUpdatedAtKeyProps(),
		});

		await this.createForeignKeyConstraint("userRoles", "userRoleRoleId", "roles", "roleId");

		await this.createForeignKeyConstraint("userRoles", "userRoleUserId", "users", "userId");
	}

	public override async down(): Promise<void> {
		await this.dropForeignKeyConstraint("userRoles", "userRoleUserId");

		await this.dropForeignKeyConstraint("userRoles", "userRoleRoleId");

		await this.queryInterface.dropTable("userRoles");
	}
}
