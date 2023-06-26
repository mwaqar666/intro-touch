import { Exception } from "@/backend-core/request-processor/exceptions/exception";

export class NotFoundException<T = unknown> extends Exception<T> {
	public constructor();
	public constructor(message: string);
	public constructor(message: string, context: T);
	public constructor(message?: string, context?: T) {
		message ??= "Not Found";

		super(message, 404, context);
	}
}
