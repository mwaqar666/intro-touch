import { Token } from "iocc";
import type { IConfigResolver, IConfigValidator } from "@/backend/config/interface";
import type { IConfig, IConfigValidation } from "@/backend/config/types";

export class ConfigTokenConst {
	public static readonly ConfigResolverToken: Token<IConfigResolver<IConfig, IConfigValidation>> = new Token<IConfigResolver<IConfig, IConfigValidation>>("ConfigServiceToken");
	public static readonly ConfigValidatorToken: Token<IConfigValidator<IConfigValidation>> = new Token<IConfigValidator<IConfigValidation>>("ConfigValidatorToken");
}
