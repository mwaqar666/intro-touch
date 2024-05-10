import { AbstractMigration } from "@/backend-core/database/abstract";

export class CreatePlatformAnalyticsTable extends AbstractMigration {
	public override timestamp = 1713265780533;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("platformAnalytics", {
			platformAnalyticsId: this.createPrimaryKeyProps(),
			platformAnalyticsUuid: this.createUuidKeyProps(),
			platformAnalyticsPlatformProfileId: this.createForeignKeyProps(),
			platformAnalyticsCreatedAt: this.createCreatedAtKeyProps(),
		});

		await this.createForeignKeyConstraint("platformAnalytics", "platformAnalyticsPlatformProfileId", "platformProfiles", "platformProfileId");
	}

	public override async down(): Promise<void> {
		await this.dropForeignKeyConstraint("platformAnalytics", "platformAnalyticsPlatformProfileId");

		await this.queryInterface.dropTable("platformAnalytics");
	}
}
