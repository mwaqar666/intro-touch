import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreateVerificationTokensTable extends AbstractMigration {
	public override timestamp = 1688500107595;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("verificationTokens", {
			tokenId: this.createPrimaryKeyProps(),
			tokenUuid: this.createUuidKeyProps(),
			tokenUserId: this.createForeignKeyProps(),
			tokenIdentifier: {
				allowNull: false,
				type: DataType.STRING(50),
			},
			tokenExpiry: {
				allowNull: false,
				type: DataType.DATE,
			},
			tokenType: {
				allowNull: false,
				type: DataType.INTEGER,
			},
		});

		await this.createForeignKeyConstraint("verificationTokens", "tokenUserId", "users", "userId");
	}

	public override async down(): Promise<void> {
		await this.dropForeignKeyConstraint("verificationTokens", "tokenUserId");

		await this.queryInterface.dropTable("verificationTokens");
	}
}
