import type { Key, Optional } from "@/stacks/types";
import { useBody } from "sst/node/api";
import type { IBodyParser } from "@/backend-core/request-processor/interface";

export class UrlEncodedFormParser<T extends object = object> implements IBodyParser<T> {
	public parse(): T {
		const parsedBody: T = {} as T;

		const requestBody: Optional<string> = useBody();

		if (!requestBody) return parsedBody;

		const urlSearchParams: URLSearchParams = new URLSearchParams(requestBody);

		return Array.from(urlSearchParams).reduce((parsed: T, [paramKey, paramValue]: [string, string]): T => {
			if (!paramKey) return parsed;

			parsed[paramKey as Key<T>] = paramValue as T[Key<T>];

			return parsed;
		}, parsedBody);
	}
}
