import type { IContainer } from "@/backend/core/contracts/container";

export interface IModule {
	setContainer(container: IContainer): void;

	register(): void;

	boot(): void;
}
