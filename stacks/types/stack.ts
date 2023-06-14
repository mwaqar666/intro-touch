import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export type AvailableAuthorizers = "auth" | "none";

export type ApiRequest = APIGatewayProxyEventV2;
export type ApiResponse = APIGatewayProxyStructuredResultV2;
