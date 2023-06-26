import type { IMigration } from "@/backend-core/database/interface";
import type { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export class CreateUserProfilesTable implements IMigration {
	public timestamp = 1687791044253;

	public async up(queryInterface: QueryInterface): Promise<void> {
		await queryInterface.createTable("user_profiles", {
			userProfileId: {
				primaryKey: true,
				autoIncrement: true,
				type: DataType.INTEGER,
			},
			userProfileUuid: {
				unique: true,
				allowNull: false,
				type: DataType.STRING(50),
			},
			userProfileUserId: {
				allowNull: false,
				type: DataType.INTEGER,
			},
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
			userProfileIsActive: {
				defaultValue: true,
				allowNull: false,
				type: DataType.BOOLEAN,
			},
			userProfileCreatedAt: {
				allowNull: false,
				type: DataType.DATE,
			},
			userProfileUpdatedAt: {
				allowNull: false,
				type: DataType.DATE,
			},
			userProfileDeletedAt: {
				allowNull: true,
				type: DataType.DATE,
			},
		});

		await queryInterface.addConstraint("user_profiles", {
			type: "foreign key",
			name: "user_profile_user_id_fkey",
			fields: ["userProfileUserId"],
			references: {
				table: "users",
				field: "userId",
			},
			onDelete: "cascade",
			onUpdate: "cascade",
		});
	}

	public async down(queryInterface: QueryInterface): Promise<void> {
		await queryInterface.removeConstraint("user_profiles", "user_profile_user_id_fkey");

		await queryInterface.dropTable("user_profiles");
	}
}
