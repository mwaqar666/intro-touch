import type { IAppException } from "@/backend-core/request-processor/types";

export class Exception extends Error {
	public constructor(public override readonly message: string, public readonly code: number) {
		super(message);
	}

	public toError(): IAppException {
		return {
			code: this.code,
			message: this.message,
		};
	}
}
