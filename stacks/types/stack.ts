import type { APIGatewayEventRequestContextV2, APIGatewayProxyEventHeaders, APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export type ApiRequest = APIGatewayProxyEventV2;
export type ApiResponse = APIGatewayProxyStructuredResultV2;
export type ApiRequestHeaders = APIGatewayProxyEventHeaders;
export type ApiRequestContext = APIGatewayEventRequestContextV2;

export interface IEmailTemplates {
	emailTemplateName: string;
	emailTemplateSubject: string;
	emailTemplateHtml: string;
}
