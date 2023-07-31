import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";

export type ApiRequest = APIGatewayProxyEventV2;
export type ApiResponse = APIGatewayProxyStructuredResultV2;

export interface ILambdaInput {
	request: ApiRequest;
	context: Context;
}

export interface IEmailTemplates {
	emailTemplateName: string;
	emailTemplateSubject: string;
	emailTemplateHtml: string;
}
