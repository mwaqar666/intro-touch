import type { Key } from "@/stacks/types";

export interface IConfigResolver<TConfig, TSchema> {
	resolveConfig<T extends Key<TConfig>>(key: T): TConfig[T];

	buildConfig(schema: TSchema): void;
}
