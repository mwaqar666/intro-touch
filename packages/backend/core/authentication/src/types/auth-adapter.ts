import type { Adapter, FacebookAdapter, GoogleAdapter } from "sst/node/auth";
import type { AuthAdapter } from "@/backend-core/authentication/enums";

declare module "sst/node/auth" {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export interface SessionTypes {
		user: IAuthPayload;
	}
}

export interface IAuthPayload {
	userUuid: string;
	userUsername: string;
	userFirstName: string;
	userLastName: string;
	userEmail: string;
}

export interface IAuthAdapterRecord<T extends Adapter = Adapter> {
	identifier: AuthAdapter;
	adapter: T;
}

export type IGoogleAdapter = ReturnType<typeof GoogleAdapter>;
export type IFacebookAdapter = ReturnType<typeof FacebookAdapter>;
