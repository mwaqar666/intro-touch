import type { IModule } from "@/backend/core/contracts/module";
import { RouterModule } from "@/backend/router/module";
import { UserModule } from "@/backend/user/module";
import type { Constructable } from "@/stacks/types";

export class ModuleRegister {
	public static applicationModules(): Array<Constructable<IModule>> {
		return [
			// Register application modules here

			RouterModule,
			UserModule,
		];
	}
}
