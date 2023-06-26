import { Exception } from "@/backend-core/request-processor/exceptions/exception";

export class InternalServerException<T = unknown> extends Exception<T> {
	public constructor();
	public constructor(message: string);
	public constructor(message: string, context: T);
	public constructor(message?: string, context?: T) {
		message ??= "Internal Server Exception!";

		super(message, 500, context);
	}
}
