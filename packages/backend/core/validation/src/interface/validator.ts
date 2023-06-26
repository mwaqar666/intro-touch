import type { Constructable } from "@/stacks/types";

export interface IValidator {
	validate<Schema extends object, Body extends Schema = Schema>(schema: Constructable<Schema>, body: Body): Promise<Schema>;
}
