import type { Nullable } from "@/stacks/types";
import type { IAppException } from "@/backend-core/request-processor/types";

export class Exception<T> extends Error {
	public constructor(message: string, public readonly code: number, public readonly context: Nullable<T> = null) {
		super(message);
	}

	public toError(): IAppException {
		return {
			code: this.code,
			message: this.message,
			context: this.context,
		};
	}
}
