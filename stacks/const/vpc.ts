export class VpcConst {
	public static readonly VpcId = (stage: string): string => `vpc-${stage}`;
}
