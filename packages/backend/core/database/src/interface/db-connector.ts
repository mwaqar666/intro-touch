import type { Kysely } from "kysely";

export interface IDbConnector<T> {
	connectToDatabase(): Promise<void>;

	releaseDatabaseConnection(): Promise<void>;

	getDatabaseConnection(): Kysely<T>;
}
