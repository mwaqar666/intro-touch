import type { IResolvedRoute } from "@/backend-core/router/interface";
import { ValidationTokenConst } from "@/backend-core/validation/const";
import type { IValidator } from "@/backend-core/validation/interface";
import type { Optional } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { HandlerMetaConst } from "@/backend-core/request-processor/const";
import type { IHandlerMetaResolver } from "@/backend-core/request-processor/interface";
import type { IControllerRequest, IHandlerMetaMap, IHandlerMetaType } from "@/backend-core/request-processor/types";

export class HandlerMetaResolverService implements IHandlerMetaResolver {
	public constructor(
		// Dependencies

		@Inject(ValidationTokenConst.ValidatorToken) private readonly validator: IValidator,
	) {}

	public async resolveHandlerMeta(request: IControllerRequest, context: Context, resolvedRoute: IResolvedRoute): Promise<Array<any>> {
		const controllerInstance: object = Reflect.getMetadata(HandlerMetaConst.HandlerControllerKey, resolvedRoute.handler);

		const controllerMetaMap: Optional<IHandlerMetaMap> = Reflect.getMetadata(HandlerMetaConst.HandlerMetaMapKey, controllerInstance);
		if (!controllerMetaMap) return [];

		const boundMethodIdentifier = "bound ";
		let methodName: string = resolvedRoute.handler.name;
		if (methodName.startsWith(boundMethodIdentifier)) methodName = methodName.slice(boundMethodIdentifier.length);

		let handlerMetaArray: Optional<Array<IHandlerMetaType>> = controllerMetaMap.get(methodName);
		if (!handlerMetaArray) return [];

		handlerMetaArray = handlerMetaArray.sort((firstHandlerMeta: IHandlerMetaType, secondHandlerMeta: IHandlerMetaType): number => {
			return firstHandlerMeta.parameterIndex - secondHandlerMeta.parameterIndex;
		});

		const handlerParams: Array<unknown> = [];

		for (const handlerMetaType of handlerMetaArray) {
			const resolvedHandlerParam: unknown = await this.resolveControllerMeta(request, context, handlerMetaType);
			handlerParams.push(resolvedHandlerParam);
		}

		return handlerParams;
	}

	private async resolveControllerMeta(request: IControllerRequest, context: Context, handlerMeta: IHandlerMetaType): Promise<unknown> {
		switch (handlerMeta.type) {
			case "body":
				return await this.validator.validate(handlerMeta.schema, request.body);
			case "path":
				return await this.validator.validate(handlerMeta.schema, request.pathParams);
			case "query":
				return await this.validator.validate(handlerMeta.schema, request.queryParams);
			case "request":
				return request;
			case "context":
				return context;
		}
	}
}
