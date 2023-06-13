import { Exception } from "@/backend-core/request-processor/exceptions/exception";

export class BadRequestException extends Exception {
	public constructor(message: string) {
		super(message, 400);
	}
}
