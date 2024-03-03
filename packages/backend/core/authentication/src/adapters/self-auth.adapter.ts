import { App } from "@/backend-core/core/extensions";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { ApiResponse } from "@/stacks/types";
import { createAdapter } from "sst/node/auth";
import { AuthAdapter } from "@/backend-core/authentication/enums";
import type { IAuthAdapter } from "@/backend-core/authentication/interface";
import type { IAuthAdapterRecord } from "@/backend-core/authentication/types";

export class SelfAuthAdapter implements IAuthAdapter {
	public configureAuthAdapter(): IAuthAdapterRecord {
		const selfAuthAdapter = createAdapter(() => {
			return async (): Promise<ApiResponse> => {
				const requestProcessor: IRequestProcessor = App.container.resolve(RequestProcessorTokenConst.RequestProcessorToken);

				return requestProcessor.processRequest();
			};
		});

		return {
			adapter: selfAuthAdapter(),
			identifier: AuthAdapter.SELF,
		};
	}
}
