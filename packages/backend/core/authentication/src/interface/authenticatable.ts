import type { Nullable } from "@/stacks/types";

export interface IAuthenticatable {
	getAuthIdentifier(): number;

	getAuthPassword(): Nullable<string>;

	verifyPassword(plainPassword: string): Promise<boolean>;
}
