import { Application } from "@/backend/core/concrete/application";
import type { IApplication } from "@/backend/core/contracts/application";
import type { IContainer } from "@/backend/core/contracts/container";
import type { IModule } from "@/backend/core/contracts/module";
import type { Constructable } from "@/stacks/types";
import { ModuleRegister } from "@/backend/ignition/module.register";

export class IntroTouch {
	private static _instance: IntroTouch;
	private application: IApplication;

	private constructor() {
		this.createUnderlyingApplication();
	}

	public static getInstance(): IntroTouch {
		if (this._instance) return this._instance;

		this._instance = new IntroTouch();

		return this._instance;
	}

	public bootstrapApplication(): IntroTouch {
		this.registerApplicationModules().bootApplicationModules();

		return this;
	}

	public serviceContainer(): IContainer {
		return this.application.getContainer();
	}

	private registerApplicationModules(): IntroTouch {
		const applicationModules: Array<Constructable<IModule>> = ModuleRegister.applicationModules();

		applicationModules.forEach((applicationModule: Constructable<IModule>): void => {
			this.application.registerModule(applicationModule);
		});

		return this;
	}

	private bootApplicationModules(): IntroTouch {
		this.application.bootModules();

		return this;
	}

	private createUnderlyingApplication(): void {
		this.application = new Application();

		this.application.registerContainer();
	}
}
