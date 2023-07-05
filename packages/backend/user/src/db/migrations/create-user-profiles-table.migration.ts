import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreateUserProfilesTable extends AbstractMigration {
	public timestamp = 1687791044253;

	public async up(): Promise<void> {
		await this.queryInterface.createTable("userProfiles", {
			userProfileId: this.createPrimaryKeyProps(),
			userProfileUuid: this.createUuidKeyProps(),
			userProfileUserId: this.createForeignKeyProps(),
			userProfileFirstName: {
				allowNull: false,
				type: DataType.STRING(50),
			},
			userProfileLastName: {
				allowNull: false,
				type: DataType.STRING(50),
			},
			userProfilePicture: {
				allowNull: false,
				type: DataType.STRING(255),
			},
			userProfileEmail: {
				unique: true,
				allowNull: false,
				type: DataType.STRING(50),
			},
			userProfileBio: {
				allowNull: true,
				type: DataType.TEXT,
			},
			userProfileCompany: {
				allowNull: true,
				type: DataType.STRING(255),
			},
			userProfileJobTitle: {
				allowNull: true,
				type: DataType.STRING(255),
			},
			userProfileWorkplacePhone: {
				allowNull: true,
				type: DataType.STRING(50),
			},
			userProfilePersonalPhone: {
				allowNull: true,
				type: DataType.STRING(50),
			},
			userProfileFax: {
				allowNull: true,
				type: DataType.STRING(50),
			},
			userProfileWebsite: {
				allowNull: true,
				type: DataType.STRING(255),
			},
			userProfileIsLive: {
				defaultValue: false,
				allowNull: false,
				type: DataType.BOOLEAN,
			},
			userProfileIsActive: this.createIsActiveKeyProps(),
			userProfileCreatedAt: this.createCreatedAtKeyProps(),
			userProfileUpdatedAt: this.createUpdatedAtKeyProps(),
			userProfileDeletedAt: this.createDeletedAtKeyProps(),
		});

		await this.createForeignKeyConstraint("userProfiles", "userProfileUserId", "users", "userId");
	}

	public async down(): Promise<void> {
		await this.dropForeignKeyConstraint("userProfiles", "userProfileUserId");

		await this.queryInterface.dropTable("userProfiles");
	}
}
