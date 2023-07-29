import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class AlterUsersTable extends AbstractMigration {
	public override timestamp = 1690572893715;

	public override async up(): Promise<void> {
		await this.queryInterface.addColumn("users", "userActiveUserProfileId", {
			type: DataType.INTEGER,
			references: {
				model: "userProfiles",
				key: "userProfileId",
			},
		});
	}

	public override async down(): Promise<void> {
		await this.queryInterface.removeColumn("users", "userActiveUserProfileId");
	}
}
