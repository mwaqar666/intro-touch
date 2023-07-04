---
to: packages/<%= migrationPath %>/<%= name.replace(/\s/g, "-") %>.migration.ts
---
import { AbstractMigration } from "@/backend-core/database/abstract";

export class <%= h.changeCase.pascal(name) %> extends AbstractMigration {
	public override timestamp = <%= Date.now() %>;

	public override async up(): Promise<void> {
		//
	}

	public override async down(): Promise<void> {
		//
	}
}
