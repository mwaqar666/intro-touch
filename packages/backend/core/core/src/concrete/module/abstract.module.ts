import type { IContainer } from "iocc";
import type { IModule } from "@/backend-core/core/contracts/module";

export abstract class AbstractModule implements IModule {
	protected container: IContainer;

	public setContainer(container: IContainer): void {
		this.container = container;
	}

	public async register(): Promise<void> {
		// Implement in subsequent module
	}

	public async preBoot(): Promise<void> {
		// Implement in subsequent module
	}

	public async boot(): Promise<void> {
		// Implement in subsequent module
	}

	public async postBoot(): Promise<void> {
		// Implement in subsequent module
	}

	public async preRun(): Promise<void> {
		// Implement in subsequent module
	}

	public async postRun(): Promise<void> {
		// Implement in subsequent module
	}
}
