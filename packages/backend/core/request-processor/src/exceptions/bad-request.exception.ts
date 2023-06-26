import { Exception } from "@/backend-core/request-processor/exceptions/exception";

export class BadRequestException<T = unknown> extends Exception<T> {
	public constructor();
	public constructor(message: string);
	public constructor(message: string, context: T);
	public constructor(message?: string, context?: T) {
		message ??= "Bad Request";

		super(message, 400, context);
	}
}
