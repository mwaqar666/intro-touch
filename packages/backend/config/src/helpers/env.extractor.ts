import type { AnyObject } from "@/stacks/types";

export class EnvExtractor {
	public static env<TExpectedReturn>(key: string): TExpectedReturn;
	public static env<TExpectedReturn>(environment: AnyObject, key: string): TExpectedReturn;
	public static env<TExpectedReturn>(environment: string | AnyObject, key?: string): TExpectedReturn {
		if (typeof environment === "string") return <TExpectedReturn>process.env[environment];

		return <TExpectedReturn>environment[`${key}`];
	}
}
