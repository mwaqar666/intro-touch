import type { Nullable } from "@/stacks/types";
import type { IAuthenticatableEntity } from "@/backend-core/authentication/types";

export interface IAuthEntityResolver {
	resolve(): Promise<Nullable<IAuthenticatableEntity>>;
}
