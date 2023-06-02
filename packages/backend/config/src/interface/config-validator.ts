import type { AnyObject } from "@/stacks/types";

export interface IConfigValidator<TSchema> {
	validateConfig(config: AnyObject): TSchema;
}
