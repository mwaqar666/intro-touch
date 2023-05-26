import type { ExclusiveUnion } from "@/stacks/types";
import type { ServiceMetadata } from "typedi";

export interface IServiceMetaData<T> extends Omit<ServiceMetadata<T>, "id" | "eager" | "global" | "multiple" | "transient"> {
	value: T;
}

export type ValueProvider<T> = Omit<IServiceMetaData<T>, "type" | "factory">;
export type ClassProvider<T> = Omit<IServiceMetaData<T>, "value" | "factory">;
export type FactoryProvider<T> = Omit<IServiceMetaData<T>, "type" | "value">;

export type DependencyProvider<T> = ExclusiveUnion<[ValueProvider<T>, ClassProvider<T>, FactoryProvider<T>]>;
