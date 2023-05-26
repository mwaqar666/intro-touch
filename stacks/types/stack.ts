import type { ApiUserPoolAuthorizer } from "sst/constructs";
import type { Key } from "@/stacks/types/common";

export interface ApiAuthorizers {
	jwt: ApiUserPoolAuthorizer;
}

export type AvailableAuthorizers = Key<ApiAuthorizers> | "none" | "iam";

export type AuthorizedApi = {
	[K in Key<ApiAuthorizers>]: ApiAuthorizers[K];
};
