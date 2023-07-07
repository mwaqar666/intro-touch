import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreatePlatformsTable extends AbstractMigration {
	public override timestamp = 1688537348626;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("platforms", {
			platformId: this.createPrimaryKeyProps(),
			platformUuid: this.createUuidKeyProps(),
			platformPlatformCategoryId: this.createForeignKeyProps(),
			platformName: {
				allowNull: false,
				type: DataType.STRING(100),
			},
			platformIcon: {
				allowNull: false,
				type: DataType.STRING(255),
			},
			platformIsActive: this.createIsActiveKeyProps(),
			platformCreatedAt: this.createCreatedAtKeyProps(),
			platformUpdatedAt: this.createUpdatedAtKeyProps(),
			platformDeletedAt: this.createDeletedAtKeyProps(),
		});

		await this.createForeignKeyConstraint("platforms", "platformPlatformCategoryId", "platformCategories", "platformCategoryId");
	}

	public override async down(): Promise<void> {
		await this.dropForeignKeyConstraint("platforms", "platformPlatformCategoryId");

		await this.queryInterface.dropTable("platforms");
	}
}
