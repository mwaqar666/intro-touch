import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { ApiRequest, ApiResponse } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { Inject } from "iocc";
import { useEvent, useLambdaContext } from "sst/context";
import { createAdapter } from "sst/node/auth";
import type { IAuthAdapter } from "@/backend-core/authentication/interface";
import type { IAuthAdapterRecord } from "@/backend-core/authentication/types";

export class SelfAuthAdapter implements IAuthAdapter {
	public constructor(
		// Dependencies
		@Inject(RequestProcessorTokenConst.RequestProcessorToken) private readonly requestProcessor: IRequestProcessor,
	) {}

	public configureAuthAdapter(): IAuthAdapterRecord {
		const selfAuthAdapter = createAdapter(() => {
			return async (): Promise<ApiResponse> => {
				const request: ApiRequest = useEvent("api");
				const context: Context = useLambdaContext();

				return this.requestProcessor.processRequest(request, context);
			};
		});

		return {
			adapter: selfAuthAdapter(),
			identifier: "self",
		};
	}
}
