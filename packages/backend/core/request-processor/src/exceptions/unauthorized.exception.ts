import { Exception } from "@/backend-core/request-processor/exceptions/exception";

export class UnauthorizedException<T = unknown> extends Exception<T> {
	public constructor();
	public constructor(message: string);
	public constructor(message: string, context: T);
	public constructor(message?: string, context?: T) {
		message ??= "Unauthorized";

		super(message, 401, context);
	}
}
