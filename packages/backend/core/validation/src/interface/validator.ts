import type { Constructable } from "@/stacks/types";

export interface IValidator {
	validate<Schema extends object, Data extends object = Schema>(schema: Constructable<Schema>, data: Data): Promise<Schema>;
}
