export interface IDbConnector<T> {
	connectToDatabase(): Promise<void>;

	releaseDatabaseConnection(): Promise<void>;

	getDatabaseConnection(): T;
}
