import type { IScopedFinderOptions } from "@/backend-core/database/types";

export class RepositoryConst {
	public static readonly DefaultScopedFindOptions: IScopedFinderOptions<any> = {
		findOptions: {},
		scopes: [],
	};
}
