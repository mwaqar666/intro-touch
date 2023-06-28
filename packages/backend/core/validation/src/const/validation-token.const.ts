import { Token } from "iocc";
import type { IValidator } from "@/backend-core/validation/interface";

export class ValidationTokenConst {
	public static readonly ValidatorToken: Token<IValidator> = new Token<IValidator>("Validator");
}
