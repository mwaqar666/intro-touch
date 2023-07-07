import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreateUsersTable extends AbstractMigration {
	public override timestamp = 1687790919506;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("users", {
			userId: this.createPrimaryKeyProps(),
			userUuid: this.createUuidKeyProps(),
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
				type: DataType.STRING(255),
			},
			userIsActive: this.createIsActiveKeyProps(),
			userCreatedAt: this.createCreatedAtKeyProps(),
			userUpdatedAt: this.createUpdatedAtKeyProps(),
			userDeletedAt: this.createDeletedAtKeyProps(),
		});
	}

	public override async down(): Promise<void> {
		await this.queryInterface.dropTable("users");
	}
}
