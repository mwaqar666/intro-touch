import type { Optional } from "@/stacks/types";
import { useBody } from "sst/node/api";
import type { IBodyParser } from "@/backend-core/request-processor/interface";

export class JsonParser<T extends object = object> implements IBodyParser<T> {
	public parse(): T {
		let parsedBody: T = {} as T;

		const requestBody: Optional<string> = useBody();

		if (!requestBody) return parsedBody;

		try {
			parsedBody = JSON.parse(requestBody);

			if (parsedBody && typeof parsedBody === "object") return parsedBody;
		} catch (exception) {
			/* empty */
		}

		return parsedBody;
	}
}
