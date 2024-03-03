import type { Adapter } from "sst/node/auth/adapter/adapter";
import type { AuthAdapter } from "@/backend-core/authentication/enums";
import type { IAuthAdapter, IAuthAdapterResolver } from "@/backend-core/authentication/interface";
import type { IAuthAdapterRecord } from "@/backend-core/authentication/types";

export class AuthAdapterResolver implements IAuthAdapterResolver {
	private readonly _registeredAdapters: Array<IAuthAdapter> = [];

	public addAdapters(...adapters: Array<IAuthAdapter>): void {
		this._registeredAdapters.push(...adapters);
	}

	public resolveAdapters(): Record<AuthAdapter, Adapter> {
		return Object.fromEntries(
			this._registeredAdapters.map((authAdapter: IAuthAdapter): [AuthAdapter, Adapter] => {
				const { identifier, adapter }: IAuthAdapterRecord = authAdapter.configureAuthAdapter();

				return [identifier, adapter];
			}),
		) as Record<AuthAdapter, Adapter>;
	}
}
