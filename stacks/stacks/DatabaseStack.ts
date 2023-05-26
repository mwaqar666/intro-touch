import type { StackContext } from "sst/constructs";
import { RDS } from "sst/constructs";
import { Config } from "@/stacks/config";
import { DatabaseConst } from "@/stacks/const";

export interface IDatabaseStack {
	database: RDS;
}

export const DatabaseStack = ({ stack }: StackContext): IDatabaseStack => {
	const database: RDS = new RDS(stack, DatabaseConst.RDS_ID, {
		engine: "postgresql11.13",
		defaultDatabaseName: Config.get("DATABASE_NAME"),
	});

	stack.addOutputs({
		databaseName: database.defaultDatabaseName,
		databaseHost: database.cdk.cluster.clusterEndpoint.hostname,
		databasePort: database.cdk.cluster.clusterEndpoint.port.toString(),
	});

	return { database };
};
