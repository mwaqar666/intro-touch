import type { IMigration } from "@/backend-core/database/interface";
import type { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

export class UserMigration implements IMigration {
	public async down(queryInterface: QueryInterface): Promise<void> {
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
			userCognitoId: {
				unique: true,
				allowNull: true,
				type: DataType.STRING(50),
			},
			userIsActive: {
				defaultValue: true,
				allowNull: false,
				type: DataType.STRING(50),
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

	public async up(queryInterface: QueryInterface): Promise<void> {
		await queryInterface.dropTable("users");
	}
}
