export type IHandlerMetaMap = Map<string, IHandlerMeta>;

export type IHandlerMetaType<T = unknown, P = unknown, Q = unknown> =
	// Inject AWS request object
	| IHandlerRequestMeta

	// Inject AWS request context
	| IHandlerContextMeta

	// Inject validated body
	| IHandlerBodyMeta<T>

	// Inject validated path params
	| IHandlerPathMeta<P>

	// Inject validated query params
	| IHandlerQueryMeta<Q>;

export type IHandlerMeta<T = unknown, P = unknown, Q = unknown> = Array<IHandlerMetaType<T, P, Q>>;

export interface IHandlerRequestMeta {
	type: "request";
	parameterIndex: number;
}

export interface IHandlerContextMeta {
	type: "context";
	parameterIndex: number;
}

export interface IHandlerBodyMeta<T> {
	type: "body";
	parameterIndex: number;
	schema: T;
}

export interface IHandlerPathMeta<P> {
	type: "path";
	parameterIndex: number;
	schema: P;
}

export interface IHandlerQueryMeta<Q> {
	type: "query";
	parameterIndex: number;
	schema: Q;
}
