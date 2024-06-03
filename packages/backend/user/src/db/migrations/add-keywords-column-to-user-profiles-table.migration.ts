import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class AddKeywordsColumnToUserProfilesTable extends AbstractMigration {
	public override timestamp = 1717345567955;

	public override async up(): Promise<void> {
		await this.queryInterface.addColumn("userProfiles", "userProfileKeywords", {
			allowNull: true,
			type: DataType.TEXT,
		});
	}

	public override async down(): Promise<void> {
		await this.queryInterface.removeColumn("userProfiles", "userProfileKeywords");
	}
}
