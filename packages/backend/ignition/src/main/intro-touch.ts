import { Application } from "@/backend/core/concrete/application";
import type { IApplication } from "@/backend/core/contracts/application";
import type { IModule } from "@/backend/core/contracts/module";
import type { Constructable } from "@/stacks/types";
import { ModuleRegister } from "@/backend/ignition/module.register";

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

	public getApplication(): IApplication {
		if (this.bootstrapped) return this.application;

		throw new Error("Application not bootstrapped");
	}

	public async bootstrapApplication(): Promise<IntroTouch> {
		if (this.bootstrapped) return this;

		await this.registerApplicationModules().runApplicationModulesLifeCycle();

		this.bootstrapped = true;

		return this;
	}

	private registerApplicationModules(): IntroTouch {
		ModuleRegister.applicationModules().forEach((applicationModule: Constructable<IModule>): void => {
			this.application.registerModule(applicationModule);
		});

		return this;
	}

	private async runApplicationModulesLifeCycle(): Promise<IntroTouch> {
		await this.application.runModuleLifeCycle();

		return this;
	}

	private createUnderlyingApplication(): void {
		this.application = new Application();

		this.application.registerContainer();
	}
}
