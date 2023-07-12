import type { IMigrationRevertOptions } from "@/backend-core/database/types";

export interface IMigrationRunner {
	runMigrations(): Promise<Array<string>>;

	revertMigrations(revertMigrationOptions: IMigrationRevertOptions): Promise<Array<string>>;
}
