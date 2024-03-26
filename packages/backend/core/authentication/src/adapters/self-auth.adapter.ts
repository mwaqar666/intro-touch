import type { ApiResponse, Delegate } from "@/stacks/types";
import type { Adapter } from "sst/node/auth";
import { createAdapter } from "sst/node/auth";
import { AbstractAuthAdapter } from "@/backend-core/authentication/abstract";
import { AuthAdapter } from "@/backend-core/authentication/enums";
import type { IAuthAdapterRecord } from "@/backend-core/authentication/types";

export class SelfAuthAdapter extends AbstractAuthAdapter {
	public configureAuthAdapter(): IAuthAdapterRecord {
		const selfAuthAdapter: Delegate<[], Adapter> = createAdapter(() => {
			return async (): Promise<ApiResponse> => this.processRequest();
		});

		return {
			adapter: selfAuthAdapter(),
			identifier: AuthAdapter.Self,
		};
	}
}
