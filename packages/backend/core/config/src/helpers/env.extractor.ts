import type { IAnyObject } from "@/stacks/types";

export class EnvExtractor {
	public static env<TExpectedReturn>(key: string): TExpectedReturn;
	public static env<TExpectedReturn>(environment: IAnyObject, key: string): TExpectedReturn;
	public static env<TExpectedReturn>(environment: string | IAnyObject, key?: string): TExpectedReturn {
		if (typeof environment === "string") return <TExpectedReturn>process.env[environment];

		return <TExpectedReturn>environment[`${key}`];
	}
}
