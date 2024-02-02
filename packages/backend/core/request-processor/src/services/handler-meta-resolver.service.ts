import type { IResolvedRoute } from "@/backend-core/router/interface";
import { ValidationTokenConst } from "@/backend-core/validation/const";
import type { IValidator } from "@/backend-core/validation/interface";
import type { Nullable, Optional } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { HandlerMetaConst } from "@/backend-core/request-processor/const";
import type { IHandlerMetaResolver } from "@/backend-core/request-processor/interface";
import type { IAppRequest, IHandlerMetaMap, IHandlerMetaType, IHandlerPathMeta, IHandlerQueryMeta } from "@/backend-core/request-processor/types";

export class HandlerMetaResolverService implements IHandlerMetaResolver {
	public constructor(
		// Dependencies

		@Inject(ValidationTokenConst.ValidatorToken) private readonly validator: IValidator,
	) {}

	public async resolveHandlerMeta(request: IAppRequest, context: Context, resolvedRoute: IResolvedRoute): Promise<Array<unknown>> {
		const controllerMetaMap: Nullable<IHandlerMetaMap> = this.extractHandlerClassMetaMap(resolvedRoute);
		if (!controllerMetaMap) return [];

		return Promise.all(
			this.extractHandlerMeta(controllerMetaMap, resolvedRoute)
				.sort((firstHandlerMeta: IHandlerMetaType, secondHandlerMeta: IHandlerMetaType): number => {
					return firstHandlerMeta.parameterIndex - secondHandlerMeta.parameterIndex;
				})
				.map((handlerMetaType: IHandlerMetaType): Promise<unknown> => {
					return this.resolveMetaData(request, context, handlerMetaType);
				}),
		);
	}

	private extractHandlerClassMetaMap(resolvedRoute: IResolvedRoute): Nullable<IHandlerMetaMap> {
		const controllerInstance: object = Reflect.getMetadata(HandlerMetaConst.HandlerControllerKey, resolvedRoute.handler);

		const controllerMetaMap: Optional<IHandlerMetaMap> = Reflect.getMetadata(HandlerMetaConst.HandlerMetaMapKey, controllerInstance);

		return controllerMetaMap ?? null;
	}

	private extractHandlerMeta(controllerMetaMap: IHandlerMetaMap, resolvedRoute: IResolvedRoute): Array<IHandlerMetaType> {
		const methodName: string = this.guessHandlerName(resolvedRoute.handler.name);

		const handlerMetaArray: Optional<Array<IHandlerMetaType>> = controllerMetaMap.get(methodName);

		return handlerMetaArray ?? [];
	}

	private guessHandlerName(methodName: string): string {
		const boundMethodIdentifier = "bound ";

		return methodName.startsWith(boundMethodIdentifier) ? methodName.slice(boundMethodIdentifier.length) : methodName;
	}

	private async resolveMetaData(request: IAppRequest, context: Context, handlerMeta: IHandlerMetaType): Promise<unknown> {
		switch (handlerMeta.type) {
			case "body":
				return await this.validator.validate(handlerMeta.schema, request.body);
			case "auth":
				return this.resolveAuthMetaData(request);
			case "path":
				return this.resolvePathMetaData(request, handlerMeta);
			case "query":
				return this.resolveQueryMetaData(request, handlerMeta);
			case "request":
				return request;
			case "context":
				return context;
		}
	}

	private async resolveAuthMetaData(request: IAppRequest): Promise<unknown> {
		if ("auth" in request) return request.auth;

		return null;
	}

	private async resolvePathMetaData(request: IAppRequest, handlerMeta: IHandlerPathMeta): Promise<unknown> {
		if (typeof handlerMeta.schema === "string") {
			return request.pathParams[handlerMeta.schema];
		}

		return this.validator.validate(handlerMeta.schema, request.pathParams);
	}

	private async resolveQueryMetaData(request: IAppRequest, handlerMeta: IHandlerQueryMeta): Promise<unknown> {
		if (typeof handlerMeta.schema === "string") {
			return request.queryParams[handlerMeta.schema];
		}

		return this.validator.validate(handlerMeta.schema, request.queryParams);
	}
}
