import type { APIGatewayProxyEventV2, APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import type { ApiUserPoolAuthorizer } from "sst/constructs";
import type { Key } from "@/stacks/types/common";

export interface IApiAuthorizers {
	jwt: ApiUserPoolAuthorizer;
}

export type AvailableAuthorizers = Key<IApiAuthorizers> | "none" | "iam";

export type AuthorizedApi = {
	[K in Key<IApiAuthorizers>]: IApiAuthorizers[K];
};

export type ApiAuthRequest = APIGatewayProxyEventV2WithJWTAuthorizer;
export type ApiPublicRequest = APIGatewayProxyEventV2;

export type ApiRequest = ApiAuthRequest | ApiPublicRequest;
export type ApiResponse = APIGatewayProxyStructuredResultV2;
