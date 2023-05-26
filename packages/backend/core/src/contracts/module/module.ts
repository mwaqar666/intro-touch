import type { IContainer } from "@/backend/core/contracts/container";

export interface IModule {
	setContainer(container: IContainer): void;

	preRegister(): void;

	register(): void;

	postRegister(): void;

	preBoot(): void;

	boot(): void;

	postBoot(): void;
}
