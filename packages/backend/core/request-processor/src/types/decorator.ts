import type { Constructable } from "@/stacks/types";

export type IHandlerMetaMap = Map<string, IHandlerMeta>;

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

export type IHandlerMeta<T = object, P = object, Q = object> = Array<IHandlerMetaType<T, P, Q>>;

export interface IHandlerRequestMeta {
	type: "request";
	parameterIndex: number;
}

export interface IHandlerContextMeta {
	type: "context";
	parameterIndex: number;
}

export interface IHandlerBodyMeta<T = object> {
	type: "body";
	parameterIndex: number;
	schema: Constructable<T>;
}

export interface IHandlerAuthMeta {
	type: "auth";
	parameterIndex: number;
}

export interface IHandlerPathMeta<P = object> {
	type: "path";
	parameterIndex: number;
	schema: Constructable<P> | string;
}

export interface IHandlerQueryMeta<Q = object> {
	type: "query";
	parameterIndex: number;
	schema: Constructable<Q> | string;
}
