import type { IConfigResolver } from "@/backend-core/config/interface";
import type { IConfig } from "@/backend-core/config/types/config";
import type { IConfigValidation } from "@/backend-core/config/types/config-validation";

export type IAppConfigResolver = IConfigResolver<IConfig, IConfigValidation>;
