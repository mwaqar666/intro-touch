import type { Constructable } from "@/stacks/types";
import type { Token } from "typedi";
import { Container as TypeDIContainer } from "typedi";
import type { IContainer } from "@/backend/core/contracts/container";

export class Container implements IContainer {
	private readonly container = TypeDIContainer.of();

	public resolve<T>(token: Token<T>): T {
		return this.container.get(token);
	}

	public registerSingleton<T>(token: Token<T>, provider: Constructable<T>): void {
		this.container.set({
			id: token,
			type: provider,
			transient: false,
		});
	}

	public registerTransient<T>(token: Token<T>, provider: Constructable<T>): void {
		this.container.set({
			id: token,
			type: provider,
			transient: true,
		});
	}

	public dispose(): void {
		this.container.reset();
	}
}
