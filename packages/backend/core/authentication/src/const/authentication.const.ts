import type { IsStrongPasswordOptions } from "class-validator";

export class AuthenticationConst {
	public static readonly StrongPasswordOptions: IsStrongPasswordOptions = {
		minLength: 8,
		minLowercase: 1,
		minNumbers: 1,
		minUppercase: 1,
		minSymbols: 1,
	};
}
