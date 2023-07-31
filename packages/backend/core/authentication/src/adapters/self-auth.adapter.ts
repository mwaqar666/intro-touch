import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { ApiResponse, ILambdaInput } from "@/stacks/types";
import { Inject } from "iocc";
import { createAdapter } from "sst/node/auth";
import { BaseAdapter } from "@/backend-core/authentication/base";
import type { IAuthAdapter } from "@/backend-core/authentication/interface";
import type { IAuthAdapterRecord } from "@/backend-core/authentication/types";

export class SelfAuthAdapter extends BaseAdapter implements IAuthAdapter {
	public constructor(
		// Dependencies
		@Inject(RequestProcessorTokenConst.RequestProcessorToken) private readonly requestProcessor: IRequestProcessor,
	) {
		super();
	}

	public configureAuthAdapter(): IAuthAdapterRecord {
		const selfAuthAdapter = createAdapter(() => {
			return async (): Promise<ApiResponse> => {
				const { request, context }: ILambdaInput = this.prepareRequestAndContext();

				return this.requestProcessor.processRequest(request, context);
			};
		});

		return {
			adapter: selfAuthAdapter(),
			identifier: "self",
		};
	}
}
