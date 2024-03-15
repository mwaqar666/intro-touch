export interface IMigrationRunner {
	runMigrations(): Promise<Array<string>>;

	revertMigrations(): Promise<Array<string>>;
}
