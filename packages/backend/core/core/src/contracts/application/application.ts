import type { Constructable, Delegate } from "@/stacks/types";
import type { IContainer } from "iocc";
import type { IModule } from "@/backend-core/core/contracts/module";

export interface IApplication {
	/**
	 * Initialize the dependency container in the application.
	 *
	 * @return {void}
	 * @author Muhammad Waqar
	 */
	registerContainer(): void;

	/**
	 * Register the module with the application and run its register hook
	 *
	 * @param {Constructable<IModule>} appModule Module to register
	 * @return {Promise<void>}
	 * @author Muhammad Waqar
	 */
	registerModule(appModule: Constructable<IModule>): Promise<void>;

	/**
	 * Run the modules' "boot" cycle methods
	 *
	 * @return {Promise<void>}
	 * @author Muhammad Waqar
	 */
	bootApplicationModules(): Promise<void>;

	/**
	 * Run any arbitrary operation in the application context.
	 *
	 * @template T
	 * @param {Delegate<[IContainer], Promise<T>>} executionContext Application request
	 * @return {Promise<T>} Application response
	 * @author Muhammad Waqar
	 */
	runInApplicationContext<T>(executionContext: Delegate<[IContainer], Promise<T>>): Promise<T>;

	/**
	 * Run any arbitrary operation in the application context. It will not trigger module pre- and postRun hooks
	 *
	 * @template T
	 * @param {Delegate<[IContainer], Promise<T>>} executionContext Application request
	 * @return {Promise<T>} Application response
	 * @author Muhammad Waqar
	 */
	runInApplicationContextWithoutModuleRunHook<T>(executionContext: Delegate<[IContainer], Promise<T>>): Promise<T>;
}
