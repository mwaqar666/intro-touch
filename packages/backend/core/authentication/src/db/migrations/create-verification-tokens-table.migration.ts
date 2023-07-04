import { AbstractMigration } from "@/backend-core/database/abstract";
import { DataType } from "sequelize-typescript";

export class CreateVerificationTokensTable extends AbstractMigration {
	public override timestamp = 1688500107595;

	public override async up(): Promise<void> {
		await this.queryInterface.createTable("verification_tokens", {
			tokenId: this.createPrimaryKeyProps(),
			tokenUuid: this.createUuidKeyProps(),
			tokenUserId: this.createForeignKeyProps(),
			tokenIdentifier: {
				allowNull: false,
				type: DataType.STRING(50),
			},
		});

		await this.createForeignKeyConstraint("verification_tokens", "tokenUserId", "users", "userId");
	}

	public override async down(): Promise<void> {
		await this.dropForeignKeyConstraint("verification_tokens", "tokenUserId");

		await this.queryInterface.dropTable("verification_tokens");
	}
}
