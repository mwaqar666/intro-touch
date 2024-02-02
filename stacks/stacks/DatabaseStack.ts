import { RemovalPolicy } from "aws-cdk-lib";
import type { SecurityGroupProps } from "aws-cdk-lib/aws-ec2";
import { Peer, Port, SecurityGroup, SubnetType } from "aws-cdk-lib/aws-ec2";
import type { DatabaseClusterProps, IClusterInstance } from "aws-cdk-lib/aws-rds";
import { AuroraPostgresEngineVersion, ClusterInstance, Credentials, DatabaseCluster, DatabaseClusterEngine } from "aws-cdk-lib/aws-rds";
import type { ServerlessV2ClusterInstanceProps } from "aws-cdk-lib/aws-rds/lib/aurora-cluster-instance";
import type { SecretProps } from "aws-cdk-lib/aws-secretsmanager";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import type { StackContext } from "sst/constructs";
import { use } from "sst/constructs";
import { Config } from "@/stacks/config";
import { DatabaseConst } from "@/stacks/const";
import { VpcStack } from "@/stacks/stacks/VpcStack";
import type { IVpcStack } from "@/stacks/stacks/VpcStack";

export interface IDatabaseStack {
	databaseName: string;
	databaseHost: string;
	databasePort: string;
	databaseUser: string;
	databasePass: string;
	databaseToken: string;
}

export type IDbCommonConfig = Omit<IDatabaseStack, "databaseHost" | "databasePass">;

const databaseCommonConfig: IDbCommonConfig = {
	databaseName: Config.get("DB_NAME"),
	databasePort: Config.get("DB_PORT"),
	databaseUser: Config.get("DB_USER"),
	databaseToken: Config.get("DB_TOKEN"),
};

const DatabaseLocalStack = ({ stack }: StackContext): IDatabaseStack => {
	const { databaseName, databasePort, databaseUser, databaseToken }: IDbCommonConfig = databaseCommonConfig;
	const databaseHost: string = Config.get("DB_HOST");
	const databasePass: string = Config.get("DB_PASS");

	stack.addOutputs({
		databaseName,
		databaseHost,
		databasePort,
		databaseUser,
		databasePass,
	});

	return {
		databaseName,
		databaseHost,
		databasePort,
		databaseUser,
		databasePass,
		databaseToken,
	};
};

const DatabaseCloudStack = ({ app, stack }: StackContext): IDatabaseStack => {
	const { databaseName, databasePort, databaseUser, databaseToken }: IDbCommonConfig = databaseCommonConfig;

	const { vpc }: IVpcStack = use(VpcStack);

	// Create database security group
	const dbSecurityGroupProps: SecurityGroupProps = { vpc, allowAllOutbound: true };
	const dbSecurityGroup: SecurityGroup = new SecurityGroup(stack, DatabaseConst.DbSecurityGroup(app.stage), dbSecurityGroupProps);
	dbSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(5432), DatabaseConst.DbSecurityGroupDescription());

	// Create database secret
	const databaseSecretProps: SecretProps = {
		secretName: DatabaseConst.DatabaseCredentialsSecret(app.stage),
		generateSecretString: {
			secretStringTemplate: JSON.stringify({
				username: databaseUser,
			}),
			generateStringKey: "password",
			excludeCharacters: '/@" ',
		},
	};
	const databaseSecret: Secret = new Secret(stack, DatabaseConst.DatabaseSecretId(app.stage), databaseSecretProps);

	// Create database reader
	const databaseServerlessV2Props: ServerlessV2ClusterInstanceProps = { publiclyAccessible: true };
	const databaseWriter: IClusterInstance = ClusterInstance.serverlessV2(DatabaseConst.DatabaseWriterId(app.stage), databaseServerlessV2Props);
	const databaseReader: IClusterInstance = ClusterInstance.serverlessV2(DatabaseConst.DatabaseReaderId(app.stage), databaseServerlessV2Props);

	// Create the database
	const databaseProps: DatabaseClusterProps = {
		engine: DatabaseClusterEngine.auroraPostgres({
			version: AuroraPostgresEngineVersion.VER_15_3,
		}),
		serverlessV2MaxCapacity: 1,
		serverlessV2MinCapacity: 0.5,
		port: parseInt(databasePort),
		removalPolicy: RemovalPolicy.DESTROY,
		credentials: Credentials.fromSecret(databaseSecret),
		defaultDatabaseName: databaseName,
		writer: databaseWriter,
		readers: [databaseReader],
		vpc,
		vpcSubnets: vpc.selectSubnets({
			subnetType: SubnetType.PUBLIC,
		}),
		securityGroups: [dbSecurityGroup],
	};
	const database: DatabaseCluster = new DatabaseCluster(stack, DatabaseConst.DatabaseId(app.stage), databaseProps);

	const databaseHost: string = database.clusterEndpoint.hostname;
	const databasePass: string = databaseSecret.secretValueFromJson("password").toString();

	stack.addOutputs({
		databaseName,
		databaseHost,
		databasePort,
		databaseUser,
		databaseClusterIdentifier: database.clusterIdentifier,
		databaseSecretArn: databaseSecret.secretFullArn,
		databaseSecurityGroupId: dbSecurityGroup.securityGroupId,
		databaseSecurityGroupVpcId: dbSecurityGroup.securityGroupVpcId,
	});

	return {
		databaseName,
		databaseHost,
		databasePort,
		databaseUser,
		databasePass,
		databaseToken,
	};
};

export const DatabaseStack = (stackContext: StackContext): IDatabaseStack => {
	if (Config.isNotLocal(stackContext.app.stage)) {
		return DatabaseCloudStack(stackContext);
	}

	return DatabaseLocalStack(stackContext);
};
