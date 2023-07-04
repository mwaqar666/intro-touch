import type { Adapter, GoogleAdapter } from "sst/node/auth";

declare module "sst/node/auth" {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export interface SessionTypes {
		user: IAuthPayload;
	}
}

export interface IAuthPayload {
	userUuid: string;
	userFirstName: string;
	userLastName: string;
	userEmail: string;
}

export interface IAuthAdapterRecord<T extends Adapter = Adapter> {
	identifier: string;
	adapter: T;
}

export type IGoogleAdapter = ReturnType<typeof GoogleAdapter>;
