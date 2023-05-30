import { Application } from "@/backend/core/concrete/application";
import type { IApplication } from "@/backend/core/contracts/application";
import type { IModule } from "@/backend/core/contracts/module";
import type { Constructable } from "@/stacks/types";
import { ModuleRegister } from "@/backend/ignition/module.register";

export class IntroTouch {
	private bootstrapped: boolean;

	public constructor() {
		this.createUnderlyingApplication();

		this.bootstrapped = false;
	}

	private _application: IApplication;

	public get application(): IApplication {
		if (this.bootstrapped) return this._application;

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
			this._application.registerModule(applicationModule);
		});

		return this;
	}

	private async runApplicationModulesLifeCycle(): Promise<IntroTouch> {
		await this._application.runModuleLifeCycle();

		return this;
	}

	private createUnderlyingApplication(): void {
		this._application = new Application();

		this._application.registerContainer();
	}
}
