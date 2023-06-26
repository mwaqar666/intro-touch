import type { IMigration } from "@/backend-core/database/interface";
import type { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export class CreateUsersTable implements IMigration {
	public timestamp = 1687790919506;

	public async up(queryInterface: QueryInterface): Promise<void> {
		await queryInterface.createTable("users", {
			userId: {
				primaryKey: true,
				autoIncrement: true,
				type: DataType.INTEGER,
			},
			userUuid: {
				unique: true,
				allowNull: false,
				type: DataType.STRING(50),
			},
			userFirstName: {
				allowNull: false,
				type: DataType.STRING(50),
			},
			userLastName: {
				allowNull: false,
				type: DataType.STRING(50),
			},
			userPicture: {
				allowNull: false,
				type: DataType.STRING(255),
			},
			userEmail: {
				unique: true,
				allowNull: false,
				type: DataType.STRING(50),
			},
			userPassword: {
				allowNull: true,
				type: DataType.STRING(50),
			},
			userIsActive: {
				defaultValue: true,
				allowNull: false,
				type: DataType.BOOLEAN,
			},
			userCreatedAt: {
				allowNull: false,
				type: DataType.DATE,
			},
			userUpdatedAt: {
				allowNull: false,
				type: DataType.DATE,
			},
			userDeletedAt: {
				allowNull: true,
				type: DataType.DATE,
			},
		});
	}

	public async down(queryInterface: QueryInterface): Promise<void> {
		await queryInterface.dropTable("users");
	}
}
