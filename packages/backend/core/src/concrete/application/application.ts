import type { Constructable, Delegate } from "@/stacks/types";
import type { IContainer } from "iocc";
import { Container } from "iocc";
import type { IApplication } from "@/backend/core/contracts/application";
import type { IModule } from "@/backend/core/contracts/module";

export class Application implements IApplication {
	private lifeCycleRan: boolean;
	private container: IContainer;
	private registeredModules: Array<IModule> = [];
	private registeredModuleNames: Array<string> = [];

	public registerContainer(): void {
		this.container = Container.of();
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

	public async runApplicationContext<T>(executionContext: Delegate<[IContainer], Promise<T>>): Promise<T> {
		this.validateContainerPresence();

		this.validateModuleLifeCycleExecutedState();

		return await this.processRequestWithinRunHook<T>(executionContext);
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

	private async processRequestWithinRunHook<T>(executionContext: Delegate<[IContainer], Promise<T>>): Promise<T> {
		for (const registeredModule of this.registeredModules) {
			await registeredModule.preRun();
		}

		const executionResult: T = await executionContext(this.container);

		for (const registeredModule of this.registeredModules) {
			await registeredModule.postRun();
		}

		return executionResult;
	}

	private validateContainerPresence(): void {
		if (this.container) return;

		throw new Error('Application container has not been initialized. Run the "registerContainer" method on the application instance to register the container');
	}

	private validateModuleLifeCycleExecutedState(): void {
		if (this.lifeCycleRan) return;

		throw new Error(`Module life cycle has not been executed. Run the "runModuleLifeCycle" method on the application instance to execute the registered modules' lifecycle`);
	}

	private validateModuleAbsence(appModule: Constructable<IModule>): void {
		const modulePresent: boolean = this.registeredModuleNames.includes(appModule.name);
		if (!modulePresent) return;

		throw new Error(`Module "${appModule.name}" has already been registered`);
	}
}
