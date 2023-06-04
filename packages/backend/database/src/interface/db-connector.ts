export interface IDbConnector {
	connectToDatabase(): Promise<void>;

	releaseDatabaseConnection(): Promise<void>;
}
