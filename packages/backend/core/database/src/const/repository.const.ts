import type { IScopedFinderOptions } from "@/backend-core/database/types";

export class RepositoryConst {
	public static readonly DefaultScopedFindOptions: Required<IScopedFinderOptions<any>> = {
		findOptions: {},
		scopes: [],
	};
}
