import type { Nullable } from "@/stacks/types";

export interface IAuthenticatable {
	getAuthPrimaryKey(): number;

	getAuthPassword(): Nullable<string>;

	verifyPassword(plainPassword: string): Promise<boolean>;
}
