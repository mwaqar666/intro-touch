import type { DependencyProvider, ValueProvider } from "@/backend/common/types";
import type { Token } from "typedi";

export interface IContainer {
	get<T>(token: Token<T>): T;

	set<T>(token: Token<T>, provider: DependencyProvider<T>): void;

	push<T>(token: Token<Array<T>>, provider: ValueProvider<Array<T>>): void;
}
