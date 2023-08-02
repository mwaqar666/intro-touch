import type { ApiRequest, ILambdaInput } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { useEvent, useLambdaContext } from "sst/context";
import { useJsonBody, useQueryParams } from "sst/node/api";
import type { IRequestHandler } from "@/backend-core/request-processor/interface";
import type { IAppRequest } from "@/backend-core/request-processor/types";

export class RequestHandlerService implements IRequestHandler {
	public getRequest(): IAppRequest {
		const request: ApiRequest = useEvent("api");

		return {
			...request,
			body: useJsonBody() ?? {},
			pathParams: {},
			queryParams: useQueryParams(),
		};
	}

	public getContext(): Context {
		return useLambdaContext();
	}

	protected prepareRequestAndContext(): ILambdaInput {
		const request: ApiRequest = useEvent("api");
		const context: Context = useLambdaContext();

		return { request, context };
	}
}
