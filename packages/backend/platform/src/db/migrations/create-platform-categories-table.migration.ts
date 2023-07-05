import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreatePlatformCategoriesTable extends AbstractMigration {
	public override timestamp = 1688537292421;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("platformCategories", {
			platformCategoryId: this.createPrimaryKeyProps(),
			platformCategoryUuid: this.createUuidKeyProps(),
			platformCategoryName: {
				allowNull: false,
				type: DataType.STRING(100),
			},
			platformCategoryIsActive: this.createIsActiveKeyProps(),
			platformCategoryCreatedAt: this.createCreatedAtKeyProps(),
			platformCategoryUpdatedAt: this.createUpdatedAtKeyProps(),
			platformCategoryDeletedAt: this.createDeletedAtKeyProps(),
		});
	}

	public override async down(): Promise<void> {
		await this.queryInterface.dropTable("platformCategories");
	}
}
