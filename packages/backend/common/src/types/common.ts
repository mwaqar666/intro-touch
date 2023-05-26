import type { ExclusiveUnion, PartialOnly } from "@/stacks/types";
import type { ServiceMetadata } from "typedi";

export interface IServiceMetaData<T> extends Omit<ServiceMetadata<T>, "id" | "eager" | "global" | "multiple"> {
	value: T;
}

export type ValueProvider<T> = Omit<PartialOnly<IServiceMetaData<T>, "transient">, "type" | "factory">;
export type ClassProvider<T> = Omit<PartialOnly<IServiceMetaData<T>, "transient">, "value" | "factory">;
export type FactoryProvider<T> = Omit<PartialOnly<IServiceMetaData<T>, "transient">, "type" | "value">;

export type DependencyProvider<T> = ExclusiveUnion<[ValueProvider<T>, ClassProvider<T>, FactoryProvider<T>]>;
