import type { UserEntity } from "@/backend/user/db/entities";
import type { Nullable } from "@/stacks/types";

export interface IAuthEntityResolver {
	resolve(): Promise<Nullable<UserEntity>>;
}
