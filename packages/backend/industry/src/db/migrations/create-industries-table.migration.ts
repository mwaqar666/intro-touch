import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreateIndustriesTable extends AbstractMigration {
	public override timestamp = 1711629070802;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("industries", {
			industryId: this.createPrimaryKeyProps(),
			industryUuid: this.createUuidKeyProps(),
			industryName: {
				allowNull: false,
				type: DataType.STRING(100),
			},
			industryIsActive: this.createIsActiveKeyProps(),
			industryCreatedAt: this.createCreatedAtKeyProps(),
			industryUpdatedAt: this.createUpdatedAtKeyProps(),
			industryDeletedAt: this.createDeletedAtKeyProps(),
		});
	}

	public override async down(): Promise<void> {
		await this.queryInterface.dropTable("industries");
	}
}
