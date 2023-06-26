import { Exception } from "@/backend-core/request-processor/exceptions/exception";

export class ForbiddenException<T = unknown> extends Exception<T> {
	public constructor();
	public constructor(message: string);
	public constructor(message: string, context: T);
	public constructor(message?: string, context?: T) {
		message ??= "Forbidden";

		super(message, 403, context);
	}
}
