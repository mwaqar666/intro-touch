import { Application } from "@/backend/core/concrete/application";
import type { IApplication } from "@/backend/core/contracts/application";
import type { IModule } from "@/backend/core/contracts/module";
import type { Constructable } from "@/stacks/types";
import { ModuleRegister } from "@/backend/ignition/module.register";

export class IntroTouch {
	private bootstrapped: boolean;

	private constructor() {
		this.createUnderlyingApplication();

		this.bootstrapped = false;
	}

	private static _instance: IntroTouch;

	public static get instance(): IntroTouch {
		if (this._instance) return this._instance;

		this._instance = new IntroTouch();

		return this._instance;
	}

	private _application: IApplication;

	public get application(): IApplication {
		if (this.bootstrapped) return this._application;

		throw new Error("Application not bootstrapped");
	}

	public bootstrapApplication(): IntroTouch {
		if (this.bootstrapped) return this;

		this.registerApplicationModules().runApplicationModulesLifeCycle();

		this.bootstrapped = true;

		return this;
	}

	private registerApplicationModules(): IntroTouch {
		const applicationModules: Array<Constructable<IModule>> = ModuleRegister.applicationModules();

		applicationModules.forEach((applicationModule: Constructable<IModule>): void => {
			this._application.registerModule(applicationModule);
		});

		return this;
	}

	private runApplicationModulesLifeCycle(): IntroTouch {
		this._application.runModuleLifeCycle();

		return this;
	}

	private createUnderlyingApplication(): void {
		this._application = new Application();

		this._application.registerContainer();
	}
}
