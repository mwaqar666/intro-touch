export class DatabaseConst {
	public static readonly DatabaseId = (stage: string): string => `db-${stage}`;

	public static readonly DatabaseWriterId = (stage: string): string => `db-writer-${stage}`;

	public static readonly DatabaseReaderId = (stage: string): string => `db-reader-${stage}`;

	public static readonly DatabaseSecretId = (stage: string): string => `dbSecret-${stage}`;

	public static readonly DatabaseImportedSecretId = (stage: string): string => `dbSecretImported-${stage}`;

	public static readonly DatabaseCredentialsSecret = (stage: string): string => `dbCredentials-${stage}`;

	public static readonly DbSecurityGroup = (stage: string): string => `dbSecurityGroup-${stage}`;

	public static readonly DbSecurityGroupDescription = (): string => "Allow inbound traffic from anywhere to the DB on port 5432";
}
