import { AbstractMigration } from "@/backend-core/database/abstract";

export class CreateCustomPlatformAnalyticsTable extends AbstractMigration {
	public override timestamp = 1713265800768;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("customPlatformAnalytics", {
			customPlatformAnalyticsId: this.createPrimaryKeyProps(),
			customPlatformAnalyticsUuid: this.createUuidKeyProps(),
			customPlatformAnalyticsCusPlatId: this.createForeignKeyProps(),
			customPlatformAnalyticsCreatedAt: this.createCreatedAtKeyProps(),
		});

		await this.createForeignKeyConstraint("customPlatformAnalytics", "customPlatformAnalyticsCusPlatId", "customPlatforms", "customPlatformId");
	}

	public override async down(): Promise<void> {
		await this.dropForeignKeyConstraint("customPlatformAnalytics", "customPlatformAnalyticsCusPlatId");

		await this.queryInterface.dropTable("customPlatformAnalytics");
	}
}
