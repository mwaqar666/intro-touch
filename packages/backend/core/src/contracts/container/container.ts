import type { Constructable } from "@/stacks/types";
import type { Token } from "typedi";

export interface IContainer {
	resolve<T>(token: Token<T>): T;

	registerSingleton<T>(token: Token<T>, provider: Constructable<T, any>): void;

	registerTransient<T>(token: Token<T>, provider: Constructable<T, any>): void;
}
