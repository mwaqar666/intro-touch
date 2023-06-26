import type { Constructable, IContainer } from "iocc";
import { ContainerFactory, Token } from "iocc";

export class AppContainer {
	public static resolve<T>(token: Token<T>): T;
	public static resolve<T>(token: Constructable<T>): T;

	public static resolve<T>(token: Token<T> | Constructable<T>): T {
		const container: IContainer = AppContainer.getContainer();

		return token instanceof Token ? container.resolve(token) : container.resolve(token);
	}

	public static registerSingleton<T>(token: Constructable<T>): void;
	public static registerSingleton<T>(token: Token<T>, dependency: Constructable<T>): void;
	public static registerSingleton<T>(token: Token<T> | Constructable<T>, dependency?: Constructable<T>): void {
		const container: IContainer = AppContainer.getContainer();

		if (token instanceof Token) {
			container.registerSingleton(token, <Constructable<T>>dependency);

			return;
		}

		return container.registerSingleton(token);
	}

	public static registerTransient<T>(token: Constructable<T>): void;
	public static registerTransient<T>(token: Token<T>, dependency: Constructable<T>): void;
	public static registerTransient<T>(token: Token<T> | Constructable<T>, dependency?: Constructable<T>): void {
		const container: IContainer = AppContainer.getContainer();

		if (token instanceof Token) {
			container.registerTransient(token, <Constructable<T>>dependency);

			return;
		}

		return container.registerTransient(token);
	}

	public static getContainer(): IContainer {
		return ContainerFactory.getContainer();
	}
}
