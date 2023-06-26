import { InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { Constructable, Delegate } from "@/stacks/types";
import type { IContainer } from "iocc";
import { ContainerFactory } from "iocc";
import type { IApplication } from "@/backend-core/core/contracts/application";
import type { IModule } from "@/backend-core/core/contracts/module";

export class Application implements IApplication {
	private lifeCycleRan: boolean;
	private container: IContainer;
	private registeredModules: Array<IModule> = [];
	private registeredModuleNames: Array<string> = [];

	public initializeContainer(): void {
		this.container = ContainerFactory.getContainer();
	}

	public async registerModule(appModule: Constructable<IModule>): Promise<void> {
		this.validateContainerPresence();

		await this.registerModuleInstance(appModule);
	}

	public async bootApplicationModules(): Promise<void> {
		this.validateContainerPresence();

		if (this.lifeCycleRan) return;

		await this.runRegisteredModulesBootCycle();

		this.lifeCycleRan = true;
	}

	public async hotExecuteWithinApplicationContext<T>(executionContext: Delegate<[IContainer], Promise<T>>): Promise<T> {
		this.validateContainerPresence();

		this.validateModuleLifeCycleExecutedState();

		return this.runRegisteredModuleRunCycle(executionContext);
	}

	public async coldExecuteWithinApplicationContext<T>(executionContext: Delegate<[IContainer], Promise<T>>): Promise<T> {
		this.validateContainerPresence();

		this.validateModuleLifeCycleExecutedState();

		return executionContext(this.container);
	}

	private async registerModuleInstance(appModule: Constructable<IModule>): Promise<void> {
		this.validateModuleAbsence(appModule);

		const moduleInstance: IModule = new appModule();

		moduleInstance.setContainer(this.container);
		await moduleInstance.register();

		this.registeredModules.push(moduleInstance);
		this.registeredModuleNames.push(appModule.name);
	}

	private async runRegisteredModulesBootCycle(): Promise<void> {
		for (const registeredModule of this.registeredModules) await registeredModule.preBoot();

		for (const registeredModule of this.registeredModules) await registeredModule.boot();

		for (const registeredModule of this.registeredModules) await registeredModule.postBoot();
	}

	private async runRegisteredModuleRunCycle<T>(executionContext: Delegate<[IContainer], Promise<T>>): Promise<T> {
		for (const registeredModule of this.registeredModules) await registeredModule.preRun();

		const result: T = await executionContext(this.container);

		for (const registeredModule of this.registeredModules) await registeredModule.postRun();

		return result;
	}

	private validateContainerPresence(): void {
		if (this.container) return;

		throw new InternalServerException('Application container has not been initialized. Run the "registerContainer" method on the application instance to register the container');
	}

	private validateModuleLifeCycleExecutedState(): void {
		if (this.lifeCycleRan) return;

		throw new InternalServerException(`Module life cycle has not been executed. Run the "runModuleLifeCycle" method on the application instance to execute the registered modules' lifecycle`);
	}

	private validateModuleAbsence(appModule: Constructable<IModule>): void {
		const modulePresent: boolean = this.registeredModuleNames.includes(appModule.name);
		if (!modulePresent) return;

		throw new InternalServerException(`Module "${appModule.name}" has already been registered`);
	}
}
