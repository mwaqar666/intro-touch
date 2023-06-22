import type { ISubnet } from "aws-cdk-lib/aws-ec2";
import { IpAddresses, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import type { StackContext } from "sst/constructs";
import { VpcConst } from "@/stacks/const";

export interface IVpcStack {
	vpc: Vpc;
}

export const VpcStack = ({ app, stack }: StackContext): IVpcStack => {
	const vpc: Vpc = new Vpc(stack, VpcConst.VpcId(app.stage), {
		ipAddresses: IpAddresses.cidr("10.0.0.0/16"),
		subnetConfiguration: [
			{
				name: "egress",
				subnetType: SubnetType.PUBLIC,
			},
		],
		natGateways: 0,
	});

	stack.addOutputs({
		vpcId: vpc.vpcId,
		vpcArn: vpc.vpcArn,
		vpcCidrBlock: vpc.vpcCidrBlock,
		vpcInternetGatewayId: vpc.internetGatewayId,
		vpcDefaultSecurityGroup: vpc.vpcDefaultSecurityGroup,
		vpcPublicSubnets: vpc.publicSubnets.map(({ subnetId }: ISubnet): string => subnetId).join(", "),
		vpcPrivateSubnets: vpc.privateSubnets.map(({ subnetId }: ISubnet): string => subnetId).join(", "),
		vpcIsolatedSubnets: vpc.isolatedSubnets.map(({ subnetId }: ISubnet): string => subnetId).join(", "),
	});

	return {
		vpc,
	};
};
