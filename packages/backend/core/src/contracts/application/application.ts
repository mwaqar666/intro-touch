import type { Constructable } from "@/stacks/types";
import type { IContainer } from "@/backend/core/contracts/container";
import type { IModule } from "@/backend/core/contracts/module";

export interface IApplication {
	registerContainer(): void;

	getContainer(): IContainer;

	registerModule(appModule: Constructable<IModule>): void;

	runModuleLifeCycle(): Promise<void>;
}
