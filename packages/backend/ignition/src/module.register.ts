import type { IModule } from "@/backend/core/contracts/module";
import type { Constructable } from "@/stacks/types";

export class ModuleRegister {
	public static applicationModules(): Array<Promise<Constructable<IModule>>> {
		return [
			// Register application modules here

			import("@/backend/router/module").then(({ RouterModule }) => RouterModule),
			import("@/backend/user/module").then(({ UserModule }) => UserModule),
		];
	}
}
