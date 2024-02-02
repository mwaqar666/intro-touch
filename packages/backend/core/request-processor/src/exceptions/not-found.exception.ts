import type { Nullable } from "@/stacks/types";
import { Exception } from "@/backend-core/request-processor/exceptions/exception";

export class NotFoundException<T = unknown> extends Exception<T> {
	public constructor();
	public constructor(message: string);
	public constructor(message: string, context: Nullable<T>);
	public constructor(message?: string, context?: Nullable<T>) {
		message ??= "Not Found";

		super(message, 404, context);
	}
}
