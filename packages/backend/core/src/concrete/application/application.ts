import type { Constructable } from "@/stacks/types";
import type { IContainer } from "ioc-class";
import { Container } from "ioc-class";
import type { IApplication } from "@/backend/core/contracts/application";
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

		this.registerModuleInstance(appModule);
	}

	public async runModuleLifeCycle(): Promise<void> {
		if (this.lifeCycleRan) {
			throw new Error("Module life cycle already ran!");
		}

		await this.runRegisteredModulesLifeCycle();

		this.lifeCycleRan = true;
	}

	private registerModuleInstance(appModule: Constructable<IModule>): void {
		const modulePresent: boolean = this.registeredModuleNames.includes(appModule.name);
		if (modulePresent) return;

		this.registeredModuleNames.push(appModule.name);

		const moduleInstance: IModule = new appModule();
		moduleInstance.setContainer(this.container);

		this.registeredModules.push(moduleInstance);
	}

	private async runRegisteredModulesLifeCycle(): Promise<void> {
		for (const registeredModule of this.registeredModules) {
			await registeredModule.preRegister();
		}

		for (const registeredModule of this.registeredModules) {
			await registeredModule.register();
		}

		for (const registeredModule of this.registeredModules) {
			await registeredModule.postRegister();
		}

		for (const registeredModule of this.registeredModules) {
			await registeredModule.preBoot();
		}

		for (const registeredModule of this.registeredModules) {
			await registeredModule.boot();
		}

		for (const registeredModule of this.registeredModules) {
			await registeredModule.postBoot();
		}
	}
}
