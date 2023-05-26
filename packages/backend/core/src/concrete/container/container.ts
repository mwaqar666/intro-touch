import type { DependencyProvider, ValueProvider } from "@/backend/common/types";
import type { Token } from "typedi";
import { Container as TypeDIContainer } from "typedi";
import type { IContainer } from "@/backend/core/contracts/container";

export class Container implements IContainer {
	public get<T>(token: Token<T>): T {
		return TypeDIContainer.get(token);
	}

	public set<T>(token: Token<T>, provider: DependencyProvider<T>): void {
		TypeDIContainer.set({ id: token, ...provider });
	}

	public push<T>(token: Token<Array<T>>, provider: ValueProvider<Array<T>>): void {
		try {
			const valueDependencies: Array<T> = this.get(token);
			const value: Array<T> = [...valueDependencies, ...provider.value];

			this.set(token, { value });
		} catch (exception) {
			this.set(token, { value: provider.value });
		}
	}
}
