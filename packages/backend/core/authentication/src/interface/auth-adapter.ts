import type { Adapter } from "sst/node/auth";
import type { AuthAdapter } from "@/backend-core/authentication/enums";
import type { IAuthAdapterRecord } from "@/backend-core/authentication/types";

export interface IAuthAdapter<T extends Adapter = Adapter> {
	configureAuthAdapter(): IAuthAdapterRecord<T>;
}

export interface IAuthAdapterResolver {
	addAdapters(...adapters: Array<IAuthAdapter>): void;

	resolveAdapters(): Record<AuthAdapter, Adapter>;
}
