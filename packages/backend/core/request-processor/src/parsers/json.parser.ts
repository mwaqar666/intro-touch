import type { AnyObject, Optional } from "@/stacks/types";
import { useBody } from "sst/node/api";
import type { IBodyParser } from "@/backend-core/request-processor/interface";

export class JsonParser implements IBodyParser {
	public parse(): AnyObject {
		let parsedBody: AnyObject = {};

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
