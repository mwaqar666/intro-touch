import { UnauthorizedException } from "@/backend-core/request-processor/exceptions";

export class EmailNotVerifiedException extends UnauthorizedException {
	public constructor() {
		super("Account email not verified!");
	}
}
