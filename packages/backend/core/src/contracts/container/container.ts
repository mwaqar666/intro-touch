import type { DependencyProvider } from "@/backend/common/types";
import type { Token } from "typedi";

export interface IContainer {
	resolve<T>(token: Token<T>): T;

	registerSingleton<T>(token: Token<T>, provider: DependencyProvider<T>): void;

	registerTransient<T>(token: Token<T>, provider: DependencyProvider<T>): void;
}
