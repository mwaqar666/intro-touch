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
	initializeContainer(): void;

	/**
	 * Register the module with the application and run its register hook.
	 *
	 * @param {Constructable<IModule>} appModule Module to register
	 * @return {Promise<void>}
	 * @author Muhammad Waqar
	 */
	registerModule(appModule: Constructable<IModule>): Promise<void>;

	/**
	 * Run the modules' “boot” cycle methods
	 *
	 * @return {Promise<void>}
	 * @author Muhammad Waqar
	 */
	bootApplicationModules(): Promise<void>;

	/**
	 * Run within the application context.
	 * This will also run the registered modules' pre- and post-run hooks.
	 * Use this when you need to bootstrap some code for every execution.
	 *
	 * @template T
	 * @param {Delegate<[IContainer], Promise<T>>} executionContext Application request
	 * @return {Promise<T>} Application response
	 * @author Muhammad Waqar
	 */
	hotExecuteWithinApplicationContext<T>(executionContext: Delegate<[IContainer], Promise<T>>): Promise<T>;

	/**
	 * Run within the application context.
	 * This will not run the registered modules' pre- and post-run hooks.
	 * Use this when you just need to run some code that is initialized once in the app lifecycle.
	 *
	 * @template T
	 * @param {Delegate<[IContainer], Promise<T>>} executionContext Application request
	 * @return {Promise<T>} Application response
	 * @author Muhammad Waqar
	 */
	coldExecuteWithinApplicationContext<T>(executionContext: Delegate<[IContainer], Promise<T>>): Promise<T>;
}
