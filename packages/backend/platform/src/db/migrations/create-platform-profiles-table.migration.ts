import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreatePlatformProfilesTable extends AbstractMigration {
	public override timestamp = 1688537376495;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("platformProfiles", {
			platformProfileId: this.createPrimaryKeyProps(),
			platformProfileUuid: this.createUuidKeyProps(),
			platformProfileProfileId: this.createForeignKeyProps(),
			platformProfilePlatformId: this.createForeignKeyProps(),
			platformProfileIdentity: {
				allowNull: false,
				type: DataType.STRING(255),
			},
			platformProfileIsActive: this.createIsActiveKeyProps(),
			platformProfileCreatedAt: this.createCreatedAtKeyProps(),
			platformProfileUpdatedAt: this.createUpdatedAtKeyProps(),
			platformProfileDeletedAt: this.createDeletedAtKeyProps(),
		});

		await this.createForeignKeyConstraint("platformProfiles", "platformProfileProfileId", "userProfiles", "userProfileId");

		await this.createForeignKeyConstraint("platformProfiles", "platformProfilePlatformId", "platforms", "platformId");
	}

	public override async down(): Promise<void> {
		await this.dropForeignKeyConstraint("platformProfiles", "platformProfilePlatformId");

		await this.dropForeignKeyConstraint("platformProfiles", "platformProfileProfileId");

		await this.queryInterface.dropTable("platformProfiles");
	}
}
