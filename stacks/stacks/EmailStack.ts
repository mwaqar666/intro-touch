import { CfnTemplate } from "aws-cdk-lib/aws-ses";
import type { StackContext } from "sst/constructs";
import { Config } from "@/stacks/config";
import { EmailConst } from "@/stacks/const";
import { EmailTemplateFinderPlugin } from "@/stacks/plugins";
import type { IEmailTemplates } from "@/stacks/types";

export interface IEmailStack {
	emailFrom: string;
}

export const EmailStack = async ({ app, stack }: StackContext): Promise<IEmailStack> => {
	const emailFrom: string = Config.get("EMAIL_FROM");

	const emailTemplates: Array<IEmailTemplates> = await EmailTemplateFinderPlugin.findEmailTemplates();

	const emailTemplateNames: Array<string> = emailTemplates.map((emailTemplate: IEmailTemplates): string => {
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
