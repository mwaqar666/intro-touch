import type { Adapter } from "sst/node/auth";
import type { IAuthAdapterRecord } from "@/backend-core/auth/types";

export interface IAuthAdapter<T extends Adapter = Adapter> {
	configureAuthAdapter(): IAuthAdapterRecord<T>;
}
