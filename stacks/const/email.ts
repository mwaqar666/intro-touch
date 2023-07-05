export class EmailConst {
	public static readonly EmailId = (stage: string, email: string): string => `email-${email}-${stage}`;
}
