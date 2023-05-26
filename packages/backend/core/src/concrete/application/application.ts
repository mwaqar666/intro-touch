import type { Constructable } from "@/stacks/types";
import { Container } from "@/backend/core/concrete/container";
import type { IApplication } from "@/backend/core/contracts/application";
import type { IContainer } from "@/backend/core/contracts/container";
import type { IModule } from "@/backend/core/contracts/module";

export class Application implements IApplication {
	private booted: boolean;
	private container: IContainer;
	private registeredModules: Array<IModule> = [];

	public registerContainer(): void {
		this.container = new Container();
	}

	public getContainer(): IContainer {
		if (this.container) return this.container;

		throw new Error("Container not initialized yet!");
	}

	public registerModule(module: Constructable<IModule>): void {
		if (!this.container) {
			throw new Error("No container registered to add the module!");
		}

		const moduleInstance: IModule = this.runModuleRegisterCycle(module);

		this.registeredModules.push(moduleInstance);
	}

	public bootModules(): void {
		if (this.booted) {
			throw new Error("Application already booted!");
		}

		this.runRegisteredModulesBootCycle();

		this.booted = true;
	}

	private runModuleRegisterCycle(module: Constructable<IModule>): IModule {
		const moduleInstance: IModule = new module();

		moduleInstance.setContainer(this.container);
		moduleInstance.register();

		return moduleInstance;
	}

	private runRegisteredModulesBootCycle(): void {
		this.registeredModules.forEach((module: IModule) => module.boot());
	}
}
