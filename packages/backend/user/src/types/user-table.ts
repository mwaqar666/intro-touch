import type { ITableUtils } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import type { Generated } from "kysely";

export interface IUser extends ITableUtils<"user"> {
	userId: Generated<number>;
	userCognitoId: Nullable<string>;
	userFirstName: string;
	userMiddleName: string;
	userLastName: string;
	userEmail: string;
}
