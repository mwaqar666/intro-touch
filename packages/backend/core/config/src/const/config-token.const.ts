import { Token } from "iocc";
import type { IConfigValidator } from "@/backend-core/config/interface";
import type { IAppConfigResolver, IConfigValidation } from "@/backend-core/config/types";

export class ConfigTokenConst {
	public static readonly ConfigResolverToken: Token<IAppConfigResolver> = new Token<IAppConfigResolver>("ConfigServiceToken");
	public static readonly ConfigValidatorToken: Token<IConfigValidator<IConfigValidation>> = new Token<IConfigValidator<IConfigValidation>>("ConfigValidatorToken");
}
