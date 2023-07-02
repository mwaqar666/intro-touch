import type { Optional } from "@/stacks/types";
import { HandlerMetaConst } from "@/backend-core/request-processor/const";
import type { IHandlerBodyMeta, IHandlerContextMeta, IHandlerMeta, IHandlerMetaMap, IHandlerMetaType, IHandlerPathMeta, IHandlerQueryMeta, IHandlerRequestMeta } from "@/backend-core/request-processor/types";

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

export const Body = <T, S>(schema: S): ParameterDecorator => {
	return <ParameterDecorator>((target: T, propertyKey: string, parameterIndex: number): void => {
		let handlerMetaMap: IHandlerMetaMap = getHandlerMetaMap(target);

		const handlerBodyMeta: IHandlerBodyMeta<S> = { type: "body", schema, parameterIndex };

		handlerMetaMap = addHandlerMeta(propertyKey, handlerMetaMap, handlerBodyMeta);

		setHandlerMetaMap(target, handlerMetaMap);
	});
};

export const Query = <T, S>(schema: S): ParameterDecorator => {
	return <ParameterDecorator>((target: T, propertyKey: string, parameterIndex: number): void => {
		let handlerMetaMap: IHandlerMetaMap = getHandlerMetaMap(target);

		const handlerQueryMeta: IHandlerQueryMeta<S> = { type: "query", schema, parameterIndex };

		handlerMetaMap = addHandlerMeta(propertyKey, handlerMetaMap, handlerQueryMeta);

		setHandlerMetaMap(target, handlerMetaMap);
	});
};

export const Path = <T, S>(schema: S): ParameterDecorator => {
	return <ParameterDecorator>((target: T, propertyKey: string, parameterIndex: number): void => {
		let handlerMetaMap: IHandlerMetaMap = getHandlerMetaMap(target);

		const handlerPathMeta: IHandlerPathMeta<S> = { type: "path", schema, parameterIndex };

		handlerMetaMap = addHandlerMeta(propertyKey, handlerMetaMap, handlerPathMeta);

		setHandlerMetaMap(target, handlerMetaMap);
	});
};

export const Request: ParameterDecorator = <ParameterDecorator>(<T>(target: T, propertyKey: string, parameterIndex: number): void => {
	let handlerMetaMap: IHandlerMetaMap = getHandlerMetaMap(target);

	const handlerRequestMeta: IHandlerRequestMeta = { type: "request", parameterIndex };

	handlerMetaMap = addHandlerMeta(propertyKey, handlerMetaMap, handlerRequestMeta);

	setHandlerMetaMap(target, handlerMetaMap);
});

export const Context: ParameterDecorator = <ParameterDecorator>(<T>(target: T, propertyKey: string, parameterIndex: number): void => {
	let handlerMetaMap: IHandlerMetaMap = getHandlerMetaMap(target);

	const handlerContextMeta: IHandlerContextMeta = { type: "context", parameterIndex };

	handlerMetaMap = addHandlerMeta(propertyKey, handlerMetaMap, handlerContextMeta);

	setHandlerMetaMap(target, handlerMetaMap);
});
