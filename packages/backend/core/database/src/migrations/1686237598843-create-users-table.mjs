/**
 * @param {Kysely<IDatabase>} db
 * @return {Promise<void>}
 */
export async function up(db) {
	await db.schema
		.createTable("users")
		.addColumn("userId", "bigint", (col) => col.primaryKey())
		.addColumn("userUuid", "varchar", (col) => col.unique().notNull())
		.addColumn("userCognitoId", "varchar", (col) => col.unique())
		.addColumn("userFirstName", "varchar", (col) => col.notNull())
		.addColumn("userMiddleName", "varchar")
		.addColumn("userLastName", "varchar", (col) => col.notNull())
		.addColumn("userEmail", "varchar", (col) => col.notNull())
		.addColumn("userCreatedAt", "timestamp", (col) => col.notNull())
		.addColumn("userUpdatedAt", "timestamp", (col) => col.notNull())
		.addColumn("userDeletedAt", "timestamp", (col) => col.notNull())
		.execute();
}

/**
 * @param {Kysely<IDatabase>} db
 * @return {Promise<void>}
 */
export async function down(db) {
	await db.schema.dropTable("users").execute();
}
