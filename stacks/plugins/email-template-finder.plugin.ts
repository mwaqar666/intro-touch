import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import fastGlob from "fast-glob";
import type { IEmailTemplates } from "@/stacks/types";

export class EmailTemplateFinderPlugin {
	public static async findEmailTemplates(): Promise<Array<IEmailTemplates>> {
		const emailTemplatePaths: Array<string> = await fastGlob("packages/**/*.email.html");

		return EmailTemplateFinderPlugin.prepareEmailTemplates(emailTemplatePaths);
	}

	public static createEmailTemplateName(emailTemplatePath: string): string {
		return basename(emailTemplatePath, ".html").replace(".", "-");
	}

	private static async prepareEmailTemplates(emailTemplatePaths: Array<string>): Promise<Array<IEmailTemplates>> {
		const emailTemplates: Array<IEmailTemplates> = [];

		for (const emailTemplatePath of emailTemplatePaths) {
			const emailTemplateName: string = EmailTemplateFinderPlugin.createEmailTemplateName(emailTemplatePath);
			const emailTemplateHtml: string = await readFile(emailTemplatePath, "utf8");
			const emailTemplateSubject: string = EmailTemplateFinderPlugin.extractEmailSubject(emailTemplateName, emailTemplateHtml);

			emailTemplates.push({ emailTemplateName, emailTemplateSubject, emailTemplateHtml });
		}

		return emailTemplates;
	}

	private static extractEmailSubject(emailTemplateName: string, emailTemplateHtml: string): string {
		const [titleStartTag, titleEndTag]: [string, string] = ["<title>", "</title>"];

		const titleStartTagPosition: number = emailTemplateHtml.indexOf(titleStartTag);
		if (titleStartTagPosition === -1) throw new Error(`Subject not found in email: ${emailTemplateName}`);

		const titleEndTagPosition: number = emailTemplateHtml.indexOf(titleEndTag);
		if (titleEndTagPosition === -1) throw new Error(`Subject not found in email: ${emailTemplateName}`);

		const subjectStringStartingIndex: number = titleStartTagPosition + titleStartTag.length;

		return emailTemplateHtml.slice(subjectStringStartingIndex, titleEndTagPosition);
	}
}
