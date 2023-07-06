export class EmailConst {
	public static readonly EmailId = (stage: string, email: string): string => `email-${email}-${stage}`;

	public static readonly EmailName = (stage: string, name: string): string => `${name}-${stage}`;
}
