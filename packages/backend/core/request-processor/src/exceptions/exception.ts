import type { Nullable } from "@/stacks/types";
import type { HttpStatusCode } from "@/backend-core/request-processor/enums";
import type { IAppException } from "@/backend-core/request-processor/types";

export class Exception<T> extends Error {
	public constructor(
		public override readonly message: string,
		public readonly code: HttpStatusCode,
		public readonly context: Nullable<T> = null,
	) {
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
