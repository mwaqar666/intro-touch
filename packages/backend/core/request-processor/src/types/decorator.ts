import type { Constructable } from "@/stacks/types";

export type IHandlerMetaMap = Map<string, IHandlerMeta>;

export type IHandlerMeta<T = object, P = object, Q = object> = Array<IHandlerMetaType<T, P, Q>>;

export type IHandlerMetaType<T = object, P = object, Q = object> =
	// Inject AWS request object
	| IHandlerRequestMeta

	// Inject AWS request context
	| IHandlerContextMeta

	// Inject authenticated entity
	| IHandlerAuthMeta

	// Inject validated body
	| IHandlerBodyMeta<T>

	// Inject validated path params
	| IHandlerPathMeta<P>

	// Inject validated query params
	| IHandlerQueryMeta<Q>;

export interface IHandlerBaseMeta {
	parameterIndex: number;
}

export interface IHandlerRequestMeta extends IHandlerBaseMeta {
	type: "request";
}

export interface IHandlerContextMeta extends IHandlerBaseMeta {
	type: "context";
}

export interface IHandlerBodyMeta<T = object> extends IHandlerBaseMeta {
	type: "body";
	schema: Constructable<T>;
}

export interface IHandlerAuthMeta extends IHandlerBaseMeta {
	type: "auth";
}

export interface IHandlerPathMeta<P = object> extends IHandlerBaseMeta {
	type: "path";
	schema: Constructable<P> | string;
}

export interface IHandlerQueryMeta<Q = object> extends IHandlerBaseMeta {
	type: "query";
	schema: Constructable<Q> | string;
}
