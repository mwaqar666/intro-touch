import type { Adapter } from "sst/node/auth/adapter/adapter";
import type { IAuthAdapter, IAuthAdapterResolver } from "@/backend-core/authentication/interface";
import type { IAuthAdapterRecord } from "@/backend-core/authentication/types";

export class AuthAdapterResolverService implements IAuthAdapterResolver {
	private readonly _registeredAdapters: Array<IAuthAdapter> = [];

	public addAdapters(...adapters: Array<IAuthAdapter>): void {
		this._registeredAdapters.push(...adapters);
	}

	public resolveAdapters(): Record<string, Adapter> {
		return Object.fromEntries(
			this._registeredAdapters.map((authAdapter: IAuthAdapter): [string, Adapter] => {
				const { identifier, adapter }: IAuthAdapterRecord = authAdapter.configureAuthAdapter();

				return [identifier, adapter];
			}),
		);
	}
}
