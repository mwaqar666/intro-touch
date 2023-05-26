import type { IContainer } from "@/backend/core/contracts/container";
import type { IModule } from "@/backend/core/contracts/module";

export abstract class AbstractModule implements IModule {
	protected container: IContainer;

	public setContainer(container: IContainer): void {
		this.container = container;
	}

	public abstract boot(): void;

	public abstract register(): void;
}
