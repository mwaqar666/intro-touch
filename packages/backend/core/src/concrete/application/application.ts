import type { Constructable } from "@/stacks/types";
import { Container } from "@/backend/core/concrete/container";
import type { IApplication } from "@/backend/core/contracts/application";
import type { IContainer } from "@/backend/core/contracts/container";
import type { IModule } from "@/backend/core/contracts/module";

export class Application implements IApplication {
	private lifeCycleRan: boolean;
	private container: IContainer;
	private registeredModules: Array<IModule> = [];
	private registeredModuleNames: Array<string> = [];

	public registerContainer(): void {
		this.container = new Container();
	}

	public getContainer(): IContainer {
		if (this.container) return this.container;

		throw new Error("Container not initialized yet!");
	}

	public registerModule(appModule: Constructable<IModule>): void {
		if (!this.container) {
			throw new Error("No container registered to add the module!");
		}

		this.verifyModuleIsNotRegisteredTwice(appModule);

		this.registerModuleInstance(appModule);
	}

	public runModuleLifeCycle(): void {
		if (this.lifeCycleRan) {
			throw new Error("Module life cycle already ran!");
		}

		this.runRegisteredModulesLifeCycle();

		this.lifeCycleRan = true;
	}

	private verifyModuleIsNotRegisteredTwice(appModule: Constructable<IModule>): void {
		const modulePresent: boolean = this.registeredModuleNames.includes(appModule.name);
		if (!modulePresent) return;

		throw new Error(`Module "${appModule.name}" is already registered!`);
	}

	private registerModuleInstance(appModule: Constructable<IModule>): void {
		this.registeredModuleNames.push(appModule.name);

		const moduleInstance: IModule = new appModule();
		moduleInstance.setContainer(this.container);

		this.registeredModules.push(moduleInstance);
	}

	private runRegisteredModulesLifeCycle(): void {
		this.registeredModules.forEach((appModule: IModule) => appModule.preRegister());
		this.registeredModules.forEach((appModule: IModule) => appModule.register());
		this.registeredModules.forEach((appModule: IModule) => appModule.postRegister());

		this.registeredModules.forEach((appModule: IModule) => appModule.preBoot());
		this.registeredModules.forEach((appModule: IModule) => appModule.boot());
		this.registeredModules.forEach((appModule: IModule) => appModule.postBoot());
	}
}
