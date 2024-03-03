import type { Adapter } from "sst/node/auth/adapter/adapter";
import type { AuthAdapter } from "@/backend-core/authentication/enums";
import type { IAuthAdapter } from "@/backend-core/authentication/interface/auth-adapter";

export interface IAuthAdapterResolver {
	addAdapters(...adapters: Array<IAuthAdapter>): void;

	resolveAdapters(): Record<AuthAdapter, Adapter>;
}
