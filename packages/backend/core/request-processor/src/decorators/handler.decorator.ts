import type { Constructable, Optional } from "@/stacks/types";
import { HandlerMetaConst } from "@/backend-core/request-processor/const";
import type { IHandlerAuthMeta, IHandlerBodyMeta, IHandlerContextMeta, IHandlerMeta, IHandlerMetaMap, IHandlerMetaType, IHandlerPathMeta, IHandlerQueryMeta, IHandlerRequestMeta } from "@/backend-core/request-processor/types";

const getHandlerMetaMap = <T>(target: T): IHandlerMetaMap => {
	const handlerMetaMap: Optional<IHandlerMetaMap> = Reflect.getMetadata(HandlerMetaConst.HandlerMetaMapKey, <object>target);

	return handlerMetaMap ?? new Map<string, IHandlerMeta>();
};

const setHandlerMetaMap = <T>(target: T, handlerMetaMap: IHandlerMetaMap): void => {
	Reflect.defineMetadata(HandlerMetaConst.HandlerMetaMapKey, handlerMetaMap, <object>target);
};

const addHandlerMeta = (handler: string, handlerMetaMap: IHandlerMetaMap, handlerMetaType: IHandlerMetaType): IHandlerMetaMap => {
	const handlerMetaArray: Optional<Array<IHandlerMetaType>> = handlerMetaMap.get(handler);

	return handlerMetaMap.set(handler, handlerMetaArray ? [...handlerMetaArray, handlerMetaType] : [handlerMetaType]);
};

export function Body<T>(schema: Constructable<object>): ParameterDecorator {
	return <ParameterDecorator>((target: T, propertyKey: string, parameterIndex: number): void => {
		let handlerMetaMap: IHandlerMetaMap = getHandlerMetaMap(target);

		const handlerBodyMeta: IHandlerBodyMeta = { type: "body", schema, parameterIndex };

		handlerMetaMap = addHandlerMeta(propertyKey, handlerMetaMap, handlerBodyMeta);

		setHandlerMetaMap(target, handlerMetaMap);
	});
}

export function Auth<T>(target: T, propertyKey: string, parameterIndex: number): void {
	let handlerMetaMap: IHandlerMetaMap = getHandlerMetaMap(target);

	const handlerAuthMeta: IHandlerAuthMeta = { type: "auth", parameterIndex };

	handlerMetaMap = addHandlerMeta(propertyKey, handlerMetaMap, handlerAuthMeta);

	setHandlerMetaMap(target, handlerMetaMap);
}

export function Query(schema: string): ParameterDecorator;
export function Query(schema: Constructable<object>): ParameterDecorator;
export function Query<T>(schema: Constructable<object> | string): ParameterDecorator {
	return <ParameterDecorator>((target: T, propertyKey: string, parameterIndex: number): void => {
		let handlerMetaMap: IHandlerMetaMap = getHandlerMetaMap(target);

		const handlerQueryMeta: IHandlerQueryMeta = { type: "query", schema, parameterIndex };

		handlerMetaMap = addHandlerMeta(propertyKey, handlerMetaMap, handlerQueryMeta);

		setHandlerMetaMap(target, handlerMetaMap);
	});
}

export function Path(schema: string): ParameterDecorator;
export function Path(schema: Constructable<object>): ParameterDecorator;
export function Path<T>(schema: Constructable<object> | string): ParameterDecorator {
	return <ParameterDecorator>((target: T, propertyKey: string, parameterIndex: number): void => {
		let handlerMetaMap: IHandlerMetaMap = getHandlerMetaMap(target);

		const handlerPathMeta: IHandlerPathMeta = { type: "path", schema, parameterIndex };

		handlerMetaMap = addHandlerMeta(propertyKey, handlerMetaMap, handlerPathMeta);

		setHandlerMetaMap(target, handlerMetaMap);
	});
}

export function Request<T>(target: T, propertyKey: string, parameterIndex: number): void {
	let handlerMetaMap: IHandlerMetaMap = getHandlerMetaMap(target);

	const handlerRequestMeta: IHandlerRequestMeta = { type: "request", parameterIndex };

	handlerMetaMap = addHandlerMeta(propertyKey, handlerMetaMap, handlerRequestMeta);

	setHandlerMetaMap(target, handlerMetaMap);
}

export function Context<T>(target: T, propertyKey: string, parameterIndex: number): void {
	let handlerMetaMap: IHandlerMetaMap = getHandlerMetaMap(target);

	const handlerContextMeta: IHandlerContextMeta = { type: "context", parameterIndex };

	handlerMetaMap = addHandlerMeta(propertyKey, handlerMetaMap, handlerContextMeta);

	setHandlerMetaMap(target, handlerMetaMap);
}
