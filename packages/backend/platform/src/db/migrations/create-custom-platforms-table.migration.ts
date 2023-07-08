import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreateCustomPlatformsTable extends AbstractMigration {
	public override timestamp = 1688537359619;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("customPlatforms", {
			customPlatformId: this.createPrimaryKeyProps(),
			customPlatformUuid: this.createUuidKeyProps(),
			customPlatformPlatformCategoryId: this.createForeignKeyProps(),
			customPlatformUserProfileId: this.createForeignKeyProps(),
			customPlatformName: {
				allowNull: false,
				type: DataType.STRING(100),
			},
			customPlatformIcon: {
				allowNull: false,
				type: DataType.STRING(255),
			},
			customPlatformIsActive: this.createIsActiveKeyProps(),
			customPlatformCreatedAt: this.createCreatedAtKeyProps(),
			customPlatformUpdatedAt: this.createUpdatedAtKeyProps(),
			customPlatformDeletedAt: this.createDeletedAtKeyProps(),
		});

		await this.createForeignKeyConstraint("customPlatforms", "customPlatformPlatformCategoryId", "platformCategories", "platformCategoryId");

		await this.createForeignKeyConstraint("customPlatforms", "customPlatformUserProfileId", "userProfiles", "userProfileId");
	}

	public override async down(): Promise<void> {
		await this.dropForeignKeyConstraint("customPlatforms", "customPlatformUserProfileId");

		await this.dropForeignKeyConstraint("customPlatforms", "customPlatformPlatformCategoryId");

		await this.queryInterface.dropTable("customPlatforms");
	}
}
