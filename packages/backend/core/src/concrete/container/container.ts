import type { DependencyProvider } from "@/backend/common/types";
import type { Token } from "typedi";
import { Container as TypeDIContainer } from "typedi";
import type { IContainer } from "@/backend/core/contracts/container";

export class Container implements IContainer {
	public resolve<T>(token: Token<T>): T {
		return TypeDIContainer.get(token);
	}

	public registerSingleton<T>(token: Token<T>, provider: DependencyProvider<T>): void {
		TypeDIContainer.set({
			id: token,
			...provider,
			transient: false,
		});
	}

	public registerTransient<T>(token: Token<T>, provider: DependencyProvider<T>): void {
		TypeDIContainer.set({
			id: token,
			...provider,
			transient: true,
		});
	}
}
