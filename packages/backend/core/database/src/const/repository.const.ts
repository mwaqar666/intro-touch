import type { ScopedFinderOptions } from "@/backend-core/database/types";

export class RepositoryConst {
	public static readonly DefaultScopedFindOptions: ScopedFinderOptions<any> = {
		findOptions: {},
		scopes: [],
	};
}
