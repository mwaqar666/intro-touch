import { Credentials } from "aws-cdk-lib/aws-rds";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import type { StackContext } from "sst/constructs";
import { RDS } from "sst/constructs";
import { Config } from "@/stacks/config";
import { DatabaseConst } from "@/stacks/const";

export interface IDatabaseStack {
	database: RDS;
	databaseUser: string;
}

export const DatabaseStack = ({ stack }: StackContext): IDatabaseStack => {
	const username: string = Config.get("DB_USER");
	const databaseName: string = Config.get("DB_NAME");

	const databaseSecret: Secret = new Secret(stack, DatabaseConst.RDS_SECRET_ID, {
		secretName: DatabaseConst.RDS_CREDENTIALS_SECRET,
		generateSecretString: {
			secretStringTemplate: JSON.stringify({ username }),
			generateStringKey: "password",
			excludeCharacters: '/@" ',
		},
	});

	const database: RDS = new RDS(stack, DatabaseConst.RDS_ID, {
		engine: "postgresql11.13",
		defaultDatabaseName: databaseName,
		migrations: "packages/backend/core/database/src/migrations",
		cdk: {
			cluster: {
				credentials: Credentials.fromSecret(databaseSecret),
			},
		},
	});

	stack.addOutputs({
		databaseName: database.defaultDatabaseName,
		databaseUser: username,
		databaseHost: database.cdk.cluster.clusterEndpoint.hostname,
		databasePort: database.cdk.cluster.clusterEndpoint.port.toString(),
		databaseSecretArn: database.secretArn,
		databaseClusterArn: database.clusterArn,
		databaseClusterIdentifier: database.clusterIdentifier,
	});

	return {
		database,
		databaseUser: username,
	};
};
