import type { Destination, SendTemplatedEmailCommandInput } from "@aws-sdk/client-ses";

export interface ISendEmailParams extends SendTemplatedEmailCommandInput {
	Destination: Required<Destination>;
	Source: string;
	Template: string;
	TemplateData: string;
}
