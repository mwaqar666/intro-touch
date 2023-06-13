import { Exception } from "@/backend-core/request-processor/exceptions/exception";

export class InternalServerException extends Exception {
	public constructor(message: string) {
		super(message, 500);
	}
}
