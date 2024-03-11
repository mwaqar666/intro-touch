import type { AnyObject, Optional } from "@/stacks/types";
import { useBody } from "sst/node/api";
import type { IBodyParser } from "@/backend-core/request-processor/interface";

export class UrlEncodedFormParser implements IBodyParser {
	public parse(): AnyObject {
		const parsedBody: AnyObject = {};

		const requestBody: Optional<string> = useBody();

		if (!requestBody) return parsedBody;

		const urlSearchParams: URLSearchParams = new URLSearchParams(requestBody);

		for (const [paramKey, paramValue] of urlSearchParams) {
			if (!paramKey) continue;

			parsedBody[paramKey] = paramValue;
		}

		return parsedBody;
	}
}
