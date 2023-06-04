import type { IConfigResolver } from "@/backend/config/interface";
import type { IConfig } from "@/backend/config/types/config";
import type { IConfigValidation } from "@/backend/config/types/config-validation";

export type IAppConfigResolver = IConfigResolver<IConfig, IConfigValidation>;
