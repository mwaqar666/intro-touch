import { Credentials } from "aws-cdk-lib/aws-rds";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import type { StackContext } from "sst/constructs";
import { RDS } from "sst/constructs";
import { Config } from "@/stacks/config";
import { DatabaseConst } from "@/stacks/const";

export interface IDatabaseStack {
	database: RDS;
}

export const DatabaseStack = ({ stack }: StackContext): IDatabaseStack => {
	const username: string = Config.get("DATABASE_USER");
	const database: string = Config.get("DATABASE_NAME");
	const databaseCredentialsName = `${database}-${username}`;

	const databaseCredentials: Credentials = Credentials.fromGeneratedSecret(username, { secretName: databaseCredentialsName });
	const password: string = Secret.fromSecretNameV2(stack, DatabaseConst.RDS_SECRET_ID, databaseCredentialsName).secretValue.toString();

	const rds: RDS = new RDS(stack, DatabaseConst.RDS_ID, {
		engine: "postgresql11.13",
		defaultDatabaseName: Config.get("DATABASE_NAME"),
		cdk: {
			cluster: {
				credentials: databaseCredentials,
			},
		},
	});

	stack.addOutputs({
		databaseName: rds.defaultDatabaseName,
		databaseUser: username,
		databasePass: password,
		databaseHost: rds.cdk.cluster.clusterEndpoint.hostname,
		databasePort: rds.cdk.cluster.clusterEndpoint.port.toString(),
	});

	return { database: rds };
};
