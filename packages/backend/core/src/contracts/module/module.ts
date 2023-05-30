import type { IContainer } from "ioc-class";

export interface IModule {
	setContainer(container: IContainer): void;

	preRegister(): Promise<void>;

	register(): Promise<void>;

	postRegister(): Promise<void>;

	preBoot(): Promise<void>;

	boot(): Promise<void>;

	postBoot(): Promise<void>;
}
