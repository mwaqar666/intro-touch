import { Aspects, RemovalPolicy } from "aws-cdk-lib";
import { InstanceType, Peer, Port, SecurityGroup, SubnetType } from "aws-cdk-lib/aws-ec2";
import { AuroraPostgresEngineVersion, CfnDBCluster, Credentials, DatabaseCluster, DatabaseClusterEngine } from "aws-cdk-lib/aws-rds";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import type { IConstruct } from "constructs";
import type { StackContext } from "sst/constructs";
import { use } from "sst/constructs";
import { Config } from "@/stacks/config";
import { DatabaseConst } from "@/stacks/const";
import { VpcStack } from "@/stacks/stacks/VpcStack";
import type { IVpcStack } from "@/stacks/stacks/VpcStack";

export interface IDatabaseStack {
	database: DatabaseCluster;
	databaseName: string;
	databaseUserName: string;
	databaseSecret: Secret;
}

export const DatabaseStack = ({ stack }: StackContext): IDatabaseStack => {
	const { vpc }: IVpcStack = use(VpcStack);

	const username: string = Config.get("DB_USER");
	const databaseName: string = Config.get("DB_NAME");
	const databasePort: string = Config.get("DB_PORT");

	const dbSecurityGroup: SecurityGroup = new SecurityGroup(stack, DatabaseConst.DB_SECURITY_GROUP, {
		vpc: vpc,
		allowAllOutbound: true,
	});
	dbSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(5432), DatabaseConst.DB_SECURITY_GROUP_DESCRIPTION);

	const databaseSecret: Secret = new Secret(stack, DatabaseConst.DATABASE_SECRET_ID, {
		secretName: DatabaseConst.DATABASE_CREDENTIALS_SECRET,
		generateSecretString: {
			secretStringTemplate: JSON.stringify({ username }),
			generateStringKey: "password",
			excludeCharacters: '/@" ',
		},
	});

	const database: DatabaseCluster = new DatabaseCluster(stack, DatabaseConst.DATABASE_ID, {
		engine: DatabaseClusterEngine.auroraPostgres({
			version: AuroraPostgresEngineVersion.VER_15_2,
		}),
		port: parseInt(databasePort),
		removalPolicy: RemovalPolicy.DESTROY,
		credentials: Credentials.fromSecret(databaseSecret),
		defaultDatabaseName: databaseName,
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
	});

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

	stack.addOutputs({
		databaseName,
		databaseHost: database.clusterEndpoint.hostname,
		databasePort: database.clusterEndpoint.port.toString(),
		databaseUser: username,
		databaseClusterIdentifier: database.clusterIdentifier,
		databaseSecretArn: databaseSecret.secretFullArn,
		databaseSecurityGroupId: dbSecurityGroup.securityGroupId,
		databaseSecurityGroupVpcId: dbSecurityGroup.securityGroupVpcId,
	});

	return {
		database,
		databaseName,
		databaseUserName: username,
		databaseSecret,
	};
};
