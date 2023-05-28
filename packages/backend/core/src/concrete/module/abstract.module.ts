import type { IContainer } from "@/backend/core/contracts/container";
import type { IModule } from "@/backend/core/contracts/module";

export abstract class AbstractModule implements IModule {
	protected container: IContainer;

	public setContainer(container: IContainer): void {
		this.container = container;
	}

	public async preRegister(): Promise<void> {
		// Implement in subsequent module
	}

	public async register(): Promise<void> {
		// Implement in subsequent module
	}

	public async postRegister(): Promise<void> {
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
}
