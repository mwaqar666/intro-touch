import type { APIGatewayProxyEventV2, APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyResultV2, Context } from "aws-lambda";

export type AuthRequest = APIGatewayProxyEventV2WithJWTAuthorizer;
export type PublicRequest = APIGatewayProxyEventV2;

export type IRequest = AuthRequest | PublicRequest;
export type IResponse = APIGatewayProxyResultV2;

export interface IRouteHandler {
	handleRoute(request: IRequest, context: Context): Promise<IResponse>;
}
