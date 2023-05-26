import type { IContainer } from "@/backend/core/contracts/container";
import type { IModule } from "@/backend/core/contracts/module";

export abstract class AbstractModule implements IModule {
	protected container: IContainer;

	public setContainer(container: IContainer): void {
		this.container = container;
	}

	public preRegister(): void {
		// Implement in subsequent module
	}

	public register(): void {
		// Implement in subsequent module
	}

	public postRegister(): void {
		// Implement in subsequent module
	}

	public preBoot(): void {
		// Implement in subsequent module
	}

	public boot(): void {
		// Implement in subsequent module
	}

	public postBoot(): void {
		// Implement in subsequent module
	}
}
