import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import type { IAuthEntityResolver } from "@/backend-core/authentication/interface";
import type { IAuthenticatableEntity } from "@/backend-core/authentication/types";
import { App } from "@/backend-core/core/extensions";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IPathParams, IQueryParams, IResolvedRoute, IRouteResolver } from "@/backend-core/router/interface";
import type { ApiRequest, ApiRequestHeaders, DeepReadonly, Key, Nullable, Optional } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { useEvent, useLambdaContext } from "sst/context";
import { InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { IBodyParser } from "@/backend-core/request-processor/interface";
import { FormDataParser, JsonParser, UrlEncodedFormParser } from "@/backend-core/request-processor/parsers";

export class Request<T extends object = object, P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams> {
	private _body: Nullable<T> = null;
	private _route: IResolvedRoute<P, Q>;
	private readonly awsRequest: DeepReadonly<ApiRequest>;

	public constructor(
		// Dependencies

		@Inject(RouterTokenConst.RouteResolverToken) private readonly routeResolver: IRouteResolver<P, Q>,
		@Inject(AuthenticationTokenConst.AuthEntityResolverToken) private readonly authEntityResolver: IAuthEntityResolver,
	) {
		this.awsRequest = useEvent("api");
	}

	public route(): IResolvedRoute<P, Q> {
		if (this._route) return this._route;

		this._route = this.routeResolver.resolveRoute();

		return this._route;
	}

	public getPathParams(): P;
	public getPathParams<Param extends Key<P>>(param: Param): P[Param];
	public getPathParams<Param extends Key<P>>(param?: Param): P | P[Param] {
		const pathParams: P = this.route().pathParams;

		if (!param) return pathParams;

		return pathParams[param];
	}

	public getQueryParams(): Q;
	public getQueryParams<Param extends Key<Q>>(param: Param): Q[Param];
	public getQueryParams<Param extends Key<Q>>(param?: Param): Q | Q[Param] {
		const queryParams: Q = this.route().queryParams;

		if (!param) return queryParams;

		return queryParams[param];
	}

	public async getBody(): Promise<T> {
		if (this._body) return this._body;

		const bodyParser: IBodyParser = this.getRequestBodyParser();

		this._body = (await bodyParser.parse(this)) as T;

		return this._body;
	}

	public setBody(body: T): void {
		this._body = body;
	}

	public getHeaders(): DeepReadonly<ApiRequestHeaders>;
	public getHeaders(header: string): Optional<string>;
	public getHeaders(header?: string): DeepReadonly<ApiRequestHeaders> | Optional<string> {
		const headers: DeepReadonly<ApiRequestHeaders> = this.awsRequest.headers;

		if (!header) return headers;

		return headers[header.toLowerCase()];
	}

	public async auth(): Promise<Nullable<IAuthenticatableEntity>> {
		return this.authEntityResolver.resolve();
	}

	public context(): Context {
		return useLambdaContext();
	}

	public getUnderlyingAwsRequest(): DeepReadonly<ApiRequest> {
		return this.awsRequest;
	}

	private getRequestBodyParser(): IBodyParser {
		const contentType: Optional<string> = this.getHeaders("Content-Type");

		if (!contentType || contentType.includes("application/json")) return App.container.resolve(JsonParser);

		if (contentType.includes("application/x-www-form-urlencoded")) return App.container.resolve(UrlEncodedFormParser);

		if (contentType.includes("multipart/form-data")) return App.container.resolve(FormDataParser);

		throw new InternalServerException("Unknown body");
	}
}
