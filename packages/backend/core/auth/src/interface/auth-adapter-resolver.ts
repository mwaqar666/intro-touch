import type { Adapter } from "sst/node/auth/adapter/adapter";
import type { IAuthAdapter } from "@/backend-core/auth/interface/auth-adapter";

export interface IAuthAdapterResolver {
	addAdapters(...adapters: Array<IAuthAdapter>): void;

	resolveAdapters(): Record<string, Adapter>;
}
