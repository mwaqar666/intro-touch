import type { Constructable } from "@/stacks/types";

export interface IValidator {
	validate<Schema extends object, Data extends Schema = Schema>(schema: Constructable<Schema>, data: Data): Promise<Schema>;
}
