import { Connections, Port } from "aws-cdk-lib/aws-ec2";
import type { StackContext } from "sst/constructs";
import { RDS } from "sst/constructs";
import { DatabaseConfig } from "@/stacks/config";
import { DatabaseConst } from "@/stacks/const";

export interface IDatabaseStack {
	database: RDS;
}

export const DatabaseStack = ({ stack }: StackContext): IDatabaseStack => {
	const rdsConnectivity: Connections = new Connections();
	rdsConnectivity.allowFromAnyIpv4(Port.allTcp());

	const database: RDS = new RDS(stack, DatabaseConst.RDS_ID, {
		engine: "postgresql11.13",
		defaultDatabaseName: DatabaseConfig.DATABASE_NAME,
	});

	stack.addOutputs({
		databaseName: database.defaultDatabaseName,
		databaseHost: database.cdk.cluster.clusterEndpoint.hostname,
		databasePort: database.cdk.cluster.clusterEndpoint.port.toString(),
	});

	return { database };
};
