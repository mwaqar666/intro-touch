export class ApiConst {
	public static ApiId = (stage: string): string => `api-${stage}`;

	public static ApiGatewayLambdaId = (stage: string): string => `apiGatewayLambda-${stage}`;
}
