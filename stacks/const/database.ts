export class DatabaseConst {
	public static readonly DATABASE_ID = "db";
	public static readonly DATABASE_PROXY_ID = "dbProxy";

	public static readonly DATABASE_SERVERLESS_V2_ID = "dbServerlessV2";

	public static readonly DATABASE_SECRET_ID = "dbSecret";
	public static readonly DATABASE_CREDENTIALS_SECRET = "dbCredentials";

	public static readonly DB_SECURITY_GROUP = "dbSecurityGroup";
	public static readonly DB_SECURITY_GROUP_DESCRIPTION = "Allow inbound traffic from anywhere to the DB on port 5432";

	public static readonly DB_LAMBDA_SECURITY_GROUP = "dbLambdaSecurityGroup";

	public static readonly DB_PROXY_SECURITY_GROUP = "dbProxySecurityGroup";
	public static readonly DB_PROXY_SECURITY_GROUP_DESCRIPTION = "Allow lambda connection to RDS Proxy";
}
