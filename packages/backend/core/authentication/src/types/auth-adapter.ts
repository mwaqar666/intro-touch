import type { Adapter, FacebookAdapter, GoogleAdapter } from "sst/node/auth";

declare module "sst/node/auth" {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export interface SessionTypes {
		user: {
			userUuid: string;
			userFirstName: string;
			userLastName: string;
			userEmail: string;
		};
	}
}

export interface IAuthAdapterRecord<T extends Adapter = Adapter> {
	identifier: string;
	adapter: T;
}

export type IGoogleAdapter = ReturnType<typeof GoogleAdapter>;
export type IFacebookAdapter = ReturnType<typeof FacebookAdapter>;
