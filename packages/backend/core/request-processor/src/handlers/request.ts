import type { UserEntity } from "@/backend/user/db/entities";
import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import type { IAuthEntityResolver } from "@/backend-core/authentication/interface";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IPathParams, IQueryParams, IResolvedRoute, IRouteResolver } from "@/backend-core/router/interface";
import type { ApiRequest, ApiRequestHeaders, DeepReadonly, Key, Nullable, Optional } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { useEvent, useLambdaContext } from "sst/context";
import { useBody } from "sst/node/api";

export class Request<T = object, P extends IPathParams = IPathParams, Q extends IQueryParams = IQueryParams> {
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

	public getBody(): T {
		if (this._body) return this._body;

		this._body = this.tryGetJsonBody();
		if (this._body) return this._body;

		this._body = this.tryGetFormDataBody();
		if (this._body) return this._body;

		this._body = {} as T;
		return this._body;
	}

	public setBody(body: T): void {
		this._body = body;
	}

	public async auth(): Promise<Nullable<UserEntity>> {
		return this.authEntityResolver.resolve();
	}

	public headers(): ApiRequestHeaders {
		return this.awsRequest.headers;
	}

	public context(): Context {
		return useLambdaContext();
	}

	private tryGetJsonBody(): Nullable<T> {
		const requestBody: Optional<string> = useBody();

		if (!requestBody) return null;

		try {
			const parsed = JSON.parse(requestBody);

			if (parsed && typeof parsed === "object") return parsed;
		} catch (exception) {
			/* empty */
		}

		return null;
	}

	private tryGetFormDataBody(): Nullable<T> {
		const requestBody: Optional<string> = useBody();

		if (!requestBody) return null;

		const parsed: T = {} as T;

		const urlSearchParams: URLSearchParams = new URLSearchParams(requestBody);

		for (const [paramKey, paramValue] of urlSearchParams) {
			if (!paramKey) continue;

			parsed[paramKey as Key<T>] = paramValue as T[Key<T>];
		}

		return parsed;
	}
}
