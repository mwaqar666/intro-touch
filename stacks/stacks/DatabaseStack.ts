import { Aspects, RemovalPolicy } from "aws-cdk-lib";
import type { SecurityGroupProps } from "aws-cdk-lib/aws-ec2";
import { InstanceType, Peer, Port, SecurityGroup, SubnetType } from "aws-cdk-lib/aws-ec2";
import type { DatabaseClusterProps } from "aws-cdk-lib/aws-rds";
import { AuroraPostgresEngineVersion, CfnDBCluster, Credentials, DatabaseCluster, DatabaseClusterEngine } from "aws-cdk-lib/aws-rds";
import type { SecretProps } from "aws-cdk-lib/aws-secretsmanager";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import type { IConstruct } from "constructs";
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
	databaseMigrationPass: string;
}

export type IDbCommonConfig = Omit<IDatabaseStack, "databaseHost" | "databasePass">;

const databaseCommonConfig: IDbCommonConfig = {
	databaseName: Config.get("DB_NAME"),
	databasePort: Config.get("DB_PORT"),
	databaseUser: Config.get("DB_USER"),
	databaseMigrationPass: Config.get("DB_MIGRATION_PASS"),
};

const DatabaseLocalStack = ({ stack }: StackContext): IDatabaseStack => {
	const { databaseName, databasePort, databaseUser, databaseMigrationPass }: IDbCommonConfig = databaseCommonConfig;
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
		databaseMigrationPass,
	};
};

const DatabaseCloudStack = ({ app, stack }: StackContext): IDatabaseStack => {
	const { databaseName, databasePort, databaseUser, databaseMigrationPass }: IDbCommonConfig = databaseCommonConfig;

	const { vpc }: IVpcStack = use(VpcStack);

	const dbSecurityGroupProps: SecurityGroupProps = {
		vpc: vpc,
		allowAllOutbound: true,
	};
	const dbSecurityGroup: SecurityGroup = new SecurityGroup(stack, DatabaseConst.DbSecurityGroup(app.stage), dbSecurityGroupProps);
	dbSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(5432), DatabaseConst.DbSecurityGroupDescription());

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

	const databaseProps: DatabaseClusterProps = {
		engine: DatabaseClusterEngine.auroraPostgres({
			version: AuroraPostgresEngineVersion.VER_15_2,
		}),
		port: parseInt(databasePort),
		removalPolicy: RemovalPolicy.DESTROY,
		credentials: Credentials.fromSecret(databaseSecret),
		defaultDatabaseName: databaseName,
		instances: 1,
		instanceProps: {
			vpc,
			vpcSubnets: vpc.selectSubnets({
				subnetType: SubnetType.PUBLIC,
			}),
			instanceType: new InstanceType("serverless"),
			autoMinorVersionUpgrade: true,
			publiclyAccessible: true,
			securityGroups: [dbSecurityGroup],
		},
	};
	const database: DatabaseCluster = new DatabaseCluster(stack, DatabaseConst.DatabaseId(app.stage), databaseProps);

	Aspects.of(database).add({
		visit(node: IConstruct): void {
			if (node instanceof CfnDBCluster) {
				node.serverlessV2ScalingConfiguration = {
					minCapacity: 0.5,
					maxCapacity: 2,
				};
			}
		},
	});

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
		databaseMigrationPass,
	};
};

export const DatabaseStack = (stackContext: StackContext): IDatabaseStack => {
	if (Config.isLocal(stackContext.app.stage)) {
		return DatabaseLocalStack(stackContext);
	}

	return DatabaseCloudStack(stackContext);
};
