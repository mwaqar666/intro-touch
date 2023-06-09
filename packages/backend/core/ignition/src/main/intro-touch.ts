import { Application } from "@/backend-core/core/concrete/application";
import type { IApplication } from "@/backend-core/core/contracts/application";
import type { IModule } from "@/backend-core/core/contracts/module";
import type { Constructable, Delegate } from "@/stacks/types";
import type { IContainer } from "iocc";
import { ModuleRegister } from "@/backend-core/ignition/module.register";

export class IntroTouch {
	private static instance: IntroTouch;
	private bootstrapped: boolean;
	private application: IApplication;

	private constructor() {
		this.createUnderlyingApplication();

		this.bootstrapped = false;
	}

	public static getInstance(): IntroTouch {
		if (IntroTouch.instance) return IntroTouch.instance;

		IntroTouch.instance = new IntroTouch();
		return IntroTouch.instance;
	}

	public async bootstrapApplication(): Promise<IntroTouch> {
		if (this.bootstrapped) return this;

		await this.registerApplicationModules();
		await this.runApplicationModulesLifeCycle();

		this.bootstrapped = true;

		return this;
	}

	public async hotExecuteWithinApplicationContext<T>(executionContext: Delegate<[IContainer], Promise<T>>): Promise<T> {
		if (!this.bootstrapped) throw new Error("Application not bootstrapped");

		return await this.application.hotExecuteWithinApplicationContext<T>(executionContext);
	}

	public async coldExecuteWithinApplicationContext<T>(executionContext: Delegate<[IContainer], Promise<T>>): Promise<T> {
		if (!this.bootstrapped) throw new Error("Application not bootstrapped");

		return await this.application.coldExecuteWithinApplicationContext<T>(executionContext);
	}

	private async registerApplicationModules(): Promise<IntroTouch> {
		const applicationModules: Array<Constructable<IModule>> = ModuleRegister.applicationModules();

		for (const applicationModule of applicationModules) {
			await this.application.registerModule(applicationModule);
		}

		return this;
	}

	private async runApplicationModulesLifeCycle(): Promise<IntroTouch> {
		await this.application.bootApplicationModules();

		return this;
	}

	private createUnderlyingApplication(): void {
		this.application = new Application();

		this.application.initializeContainer();
	}
}
