import { AppContainer } from "@/backend-core/core/extensions";
import type { Constructable } from "@/stacks/types";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IDbManager, IDbRegister } from "@/backend-core/database/interface";

export class DbExtension {
	public static registerDb(dbRegister: Constructable<IDbRegister>): void {
		AppContainer.registerSingleton(dbRegister);

		const resolvedDbRegister: IDbRegister = AppContainer.resolve(dbRegister);
		const dbManager: IDbManager = AppContainer.resolve(DbTokenConst.DbManagerToken);
		dbManager.registerModuleDb(resolvedDbRegister);
	}
}
