import type { ListTemplatesCommandInput, ListTemplatesCommandOutput, TemplateMetadata } from "@aws-sdk/client-ses";
import { ListTemplatesCommand, SESClient } from "@aws-sdk/client-ses";
import { CfnTemplate } from "aws-cdk-lib/aws-ses";
import type { StackContext } from "sst/constructs";
import { Config } from "@/stacks/config";
import { EmailConst } from "@/stacks/const";
import { EmailTemplateFinderPlugin } from "@/stacks/plugins";
import type { IEmailTemplates, Nullable } from "@/stacks/types";

export interface IEmailStack {
	emailFrom: string;
}

export const EmailStack = async ({ app, stack }: StackContext): Promise<IEmailStack> => {
	const emailFrom: string = Config.get("EMAIL_FROM");

	const existingEmailTemplates: Array<string> = [];
	const emailTemplates: Array<IEmailTemplates> = await EmailTemplateFinderPlugin.findEmailTemplates();

	// Initialize SES Client
	const sesClient = new SESClient({ region: app.region });
	const listTemplatesCommandInput: ListTemplatesCommandInput = {
		MaxItems: 100,
	};

	let nextExistingEmailTemplateListToken: Nullable<string> = null;
	let commandCalledAtLeastOnce: boolean = false;

	while (!commandCalledAtLeastOnce || nextExistingEmailTemplateListToken) {
		commandCalledAtLeastOnce = true;

		// Fetch existing email templates
		listTemplatesCommandInput.NextToken = nextExistingEmailTemplateListToken ?? undefined;
		const { TemplatesMetadata, NextToken }: ListTemplatesCommandOutput = await sesClient.send(new ListTemplatesCommand(listTemplatesCommandInput));

		nextExistingEmailTemplateListToken = NextToken ?? null;
		const templateNames: Array<string> = (TemplatesMetadata ?? []).map((templateMetadata: TemplateMetadata) => templateMetadata.Name as string);

		existingEmailTemplates.push(...templateNames);
	}

	const existingTemplateNames = new Set(existingEmailTemplates);

	const emailTemplateNames: Array<string> = emailTemplates
		.filter((emailTemplate: IEmailTemplates) => !existingTemplateNames.has(EmailConst.EmailId(app.stage, emailTemplate.emailTemplateName)))
		.map((emailTemplate: IEmailTemplates): string => {
			new CfnTemplate(stack, EmailConst.EmailId(app.stage, emailTemplate.emailTemplateName), {
				template: {
					templateName: EmailConst.EmailId(app.stage, emailTemplate.emailTemplateName),
					subjectPart: emailTemplate.emailTemplateSubject,
					htmlPart: emailTemplate.emailTemplateHtml,
				},
			});

			return emailTemplate.emailTemplateName;
		});
	stack.addOutputs({
		emailTemplates: emailTemplateNames.join(", "),
	});

	return {
		emailFrom,
	};
};
