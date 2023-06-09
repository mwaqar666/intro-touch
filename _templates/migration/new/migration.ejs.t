---
to: packages/backend/core/database/src/migrations/<%= Date.now() %>-<%= name.replace(/\s/g, "-") %>.mjs
---
/**
 * @param {import("kysely").Kysely<IDatabase>} db
 * @return {Promise<void>}
 */
export async function up(db) {
	//
}

/**
 * @param {import("kysely").Kysely<IDatabase>} db
 * @return {Promise<void>}
 */
export async function down(db) {
	//
}
