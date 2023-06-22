export class AuthConst {
	public static readonly ApiAuthId = (stage: string): string => `apiAuth-${stage}`;

	public static readonly ApiAuthHandlerLambdaId = (stage: string): string => `apiAuthHandlerLambda-${stage}`;
}
