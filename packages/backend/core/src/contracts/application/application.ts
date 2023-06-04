import type { Constructable, Delegate } from "@/stacks/types";
import type { IContainer } from "iocc";
import type { IModule } from "@/backend/core/contracts/module";

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
	 * Runs the provided callback within modules' "run" hooks and returns the result of the callback
	 *
	 * @template T
	 * @param {Delegate<[IContainer], Promise<T>>} executionContext Callback to execute
	 * @return {Promise<T>} Result of the callback
	 * @author Muhammad Waqar
	 */
	runApplicationContext<T>(executionContext: Delegate<[IContainer], Promise<T>>): Promise<T>;
}
