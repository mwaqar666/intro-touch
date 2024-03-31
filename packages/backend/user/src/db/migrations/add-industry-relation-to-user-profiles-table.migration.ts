import { AbstractMigration } from "@/backend-core/database/abstract";

export class AddIndustryRelationToUserProfilesTable extends AbstractMigration {
	public override timestamp = 1711858169916;

	public override async up(): Promise<void> {
		await this.queryInterface.addColumn("userProfiles", "userProfileIndustryId", this.createForeignKeyProps(true));

		await this.createForeignKeyConstraint("userProfiles", "userProfileIndustryId", "industries", "industryId");
	}

	public override async down(): Promise<void> {
		await this.dropForeignKeyConstraint("userProfiles", "userProfileIndustryId");

		await this.queryInterface.removeColumn("userProfiles", "userProfileIndustryId");
	}
}
