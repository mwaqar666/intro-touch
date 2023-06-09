import type { IContainer } from "iocc";
import type { IModule } from "@/backend-core/core/contracts/module";

export abstract class AbstractModule implements IModule {
	protected container: IContainer;

	public setContainer(container: IContainer): void {
		this.container = container;
	}

	public async register(): Promise<void> {
		// Override in child module
	}

	public async preBoot(): Promise<void> {
		// Override in child module
	}

	public async boot(): Promise<void> {
		// Override in child module
	}

	public async postBoot(): Promise<void> {
		// Override in child module
	}

	public async preRun(): Promise<void> {
		// Override in child module
	}

	public async postRun(): Promise<void> {
		// Override in child module
	}
}
