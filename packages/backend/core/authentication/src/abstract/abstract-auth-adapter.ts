import { App } from "@/backend-core/core/extensions";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import { Request } from "@/backend-core/request-processor/handlers";
import type { IRequestProcessor } from "@/backend-core/request-processor/interface";
import type { Action, ApiResponse } from "@/stacks/types";
import type { Adapter } from "sst/node/auth";
import type { IAuthAdapter } from "@/backend-core/authentication/interface";
import type { IAuthAdapterRecord } from "@/backend-core/authentication/types";

export abstract class AbstractAuthAdapter<TAdapter extends Adapter = Adapter> implements IAuthAdapter<TAdapter> {
	public abstract configureAuthAdapter(): IAuthAdapterRecord<TAdapter>;

	protected processRequest(): Promise<ApiResponse>;
	protected processRequest(requestCallback: Action<[Request]>): Promise<ApiResponse>;
	protected processRequest(requestCallback?: Action<[Request]>): Promise<ApiResponse> {
		const request: Request = App.container.resolve(Request);
		const requestProcessor: IRequestProcessor = App.container.resolve(RequestProcessorTokenConst.RequestProcessorToken);

		if (requestCallback) requestCallback(request);

		return requestProcessor.processRequest(request);
	}
}
