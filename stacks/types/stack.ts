import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export type ApiRequest = APIGatewayProxyEventV2;
export type ApiResponse = APIGatewayProxyStructuredResultV2;

export interface IEmailTemplates {
	emailTemplateName: string;
	emailTemplateSubject: string;
	emailTemplateHtml: string;
}
