import type { IMigrationRevertOptions } from "@/backend-core/database/types";

export interface IMigrationRunner {
	runMigrations(): Promise<void>;

	revertMigrations(revertMigrationOptions: IMigrationRevertOptions): Promise<void>;
}
