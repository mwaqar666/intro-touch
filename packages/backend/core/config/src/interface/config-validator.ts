import type { IAnyObject } from "@/stacks/types";

export interface IConfigValidator<TSchema> {
	validateConfig(config: IAnyObject): TSchema;
}
