import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreateUserContactsTableMigration extends AbstractMigration {
	public timestamp = 1687791044253;

	public async up(): Promise<void> {
		await this.queryInterface.createTable("userContacts", {
			userContactId: this.createPrimaryKeyProps(),
			userContactUuid: this.createUuidKeyProps(),
			userContactUserId: this.createForeignKeyProps(),
			userContactFirstName: {
				allowNull: false,
				type: DataType.STRING(50),
			},
			userContactLastName: {
				allowNull: false,
				type: DataType.STRING(50),
			},
			userContactPicture: {
				allowNull: true,
				type: DataType.STRING(255),
			},
			userContactEmail: {
				allowNull: true,
				type: DataType.STRING(50),
			},
			userContactNote: {
				allowNull: true,
				type: DataType.TEXT,
			},
			userContactPhone: {
				allowNull: true,
				type: DataType.STRING(50),
			},
			userContactCreatedAt: this.createCreatedAtKeyProps(),
			userContactUpdatedAt: this.createUpdatedAtKeyProps(),
			userContactDeletedAt: this.createDeletedAtKeyProps(),
		});

		await this.createForeignKeyConstraint("userContacts", "userContactUserId", "users", "userId");
	}

	public async down(): Promise<void> {
		await this.dropForeignKeyConstraint("userContacts", "userContactUserId");

		await this.queryInterface.dropTable("userContacts");
	}
}
