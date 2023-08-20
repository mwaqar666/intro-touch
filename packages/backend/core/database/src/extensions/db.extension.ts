import { App } from "@/backend-core/core/extensions";
import type { Constructable } from "@/stacks/types";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IDbManager, IDbRegister } from "@/backend-core/database/interface/db";

export class DbExtension {
	public static registerDb(dbRegister: Constructable<IDbRegister>): void {
		App.container.registerSingleton(dbRegister);

		const resolvedDbRegister: IDbRegister = App.container.resolve(dbRegister);
		const dbManager: IDbManager = App.container.resolve(DbTokenConst.DbManagerToken);
		dbManager.registerModuleDb(resolvedDbRegister);
	}
}
