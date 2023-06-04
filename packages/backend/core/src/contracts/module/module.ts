import type { IContainer } from "iocc";

export interface IModule {
	/**
	 * Sets the dependency container in the module.
	 *
	 * @param container
	 * @author Muhammad Waqar
	 */
	setContainer(container: IContainer): void;

	/**
	 * Register hook runs once per application life cycle.
	 * It is run when a module is registered with the container.
	 * You can register your dependencies in the container in this hook
	 *
	 * @author Muhammad Waqar
	 */
	register(): Promise<void>;

	/**
	 * This is the first hook to run in the module "boot" cycle.
	 * This hook runs when all the modules are registered in the container.
	 * Dependencies can be resolved from the container in this hook.
	 *
	 * @author Muhammad Waqar
	 */
	preBoot(): Promise<void>;

	/**
	 * This is the second hook to run in the module "boot" cycle.
	 * This hook runs when all the modules are registered in the container.
	 * Dependencies can be resolved from the container in this hook.
	 *
	 * @author Muhammad Waqar
	 */
	boot(): Promise<void>;

	/**
	 * This is the last hook to run in the module "boot" cycle.
	 * This hook runs when all the modules are registered in the container.
	 * Dependencies can be resolved from the container in this hook.
	 *
	 * @author Muhammad Waqar
	 */
	postBoot(): Promise<void>;

	/**
	 * This hook runs when all the modules are booted.
	 * This hook runs before the request is served.
	 * This hook runs on every incoming request.
	 *
	 * @author Muhammad Waqar
	 */
	preRun(): Promise<void>;

	/**
	 * This hook runs when all the modules are booted.
	 * This hook runs after the request is served.
	 * This hook runs on every incoming request.
	 *
	 * @author Muhammad Waqar
	 */
	postRun(): Promise<void>;
}
