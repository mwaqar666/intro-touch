---
to: packages/<%= migrationPath %>/<%= name.replace(/\s/g, "-") %>.migration.ts
---
import type { IMigration } from "@/backend-core/database/interface";
import type { QueryInterface } from "sequelize";

export class <%= h.changeCase.pascal(name) %> implements IMigration {
	public timestamp = <%= Date.now() %>;

	public async up(queryInterface: QueryInterface): Promise<void> {
		//
	}

	public async down(queryInterface: QueryInterface): Promise<void> {
		//
	}
}
