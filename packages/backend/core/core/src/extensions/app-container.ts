import type { Constructable, IContainer, IDependencyRegisterOptions } from "iocc";
import { ContainerFactory, Token } from "iocc";

export class AppContainer {
	public static get container(): IContainer {
		return ContainerFactory.getContainer();
	}

	public static resolve<T>(token: Token<T>): T;
	public static resolve<T>(token: Constructable<T>): T;

	public static resolve<T>(token: Token<T> | Constructable<T>): T {
		const container: IContainer = AppContainer.container;

		return token instanceof Token ? container.resolve(token) : container.resolve(token);
	}

	public static registerSingleton<T>(token: Constructable<T>): void;
	public static registerSingleton<T>(token: Constructable<T>, dependency: IDependencyRegisterOptions): void;
	public static registerSingleton<T>(token: Token<T>, dependency: Constructable<T>): void;
	public static registerSingleton<T>(token: Token<T>, dependency: Constructable<T>, registerOptions: IDependencyRegisterOptions): void;
	public static registerSingleton<T>(token: Token<T> | Constructable<T>, dependency?: Constructable<T> | IDependencyRegisterOptions, registerOptions?: IDependencyRegisterOptions): void {
		const container: IContainer = AppContainer.container;

		if (token instanceof Token) {
			if (registerOptions) {
				container.registerSingleton(token, <Constructable<T>>dependency, registerOptions);

				return;
			}

			container.registerSingleton(token, <Constructable<T>>dependency);

			return;
		}

		if (dependency) {
			container.registerSingleton(token, <IDependencyRegisterOptions>dependency);

			return;
		}

		return container.registerSingleton(token);
	}

	public static registerTransient<T>(token: Constructable<T>): void;
	public static registerTransient<T>(token: Constructable<T>, dependency: IDependencyRegisterOptions): void;
	public static registerTransient<T>(token: Token<T>, dependency: Constructable<T>): void;
	public static registerTransient<T>(token: Token<T>, dependency: Constructable<T>, registerOptions: IDependencyRegisterOptions): void;
	public static registerTransient<T>(token: Token<T> | Constructable<T>, dependency?: Constructable<T> | IDependencyRegisterOptions, registerOptions?: IDependencyRegisterOptions): void {
		const container: IContainer = AppContainer.container;

		if (token instanceof Token) {
			if (registerOptions) {
				container.registerTransient(token, <Constructable<T>>dependency, registerOptions);

				return;
			}

			container.registerTransient(token, <Constructable<T>>dependency);

			return;
		}

		if (dependency) {
			container.registerTransient(token, <IDependencyRegisterOptions>dependency);

			return;
		}

		return container.registerTransient(token);
	}
}
