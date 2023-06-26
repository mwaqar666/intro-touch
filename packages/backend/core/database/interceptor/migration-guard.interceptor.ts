import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IDatabaseConfig } from "@/backend-core/config/types";
import { ForbiddenException } from "@/backend-core/request-processor/exceptions";
import type { IRequestInterceptor } from "@/backend-core/request-processor/interface";
import type { IControllerRequest } from "@/backend-core/request-processor/types";
import type { Optional } from "@/stacks/types";
import { Inject } from "iocc";

export class MigrationGuardInterceptor implements IRequestInterceptor {
	public constructor(
		// Dependencies
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async intercept(request: IControllerRequest): Promise<IControllerRequest> {
		const migrationPass: Optional<string> = request.queryParams["token"];

		if (!migrationPass) throw new ForbiddenException("Invalid migration token");

		const dbConfig: IDatabaseConfig = this.configResolver.resolveConfig("database");

		if (dbConfig.databaseMigrationPass !== migrationPass) throw new ForbiddenException("Invalid migration token");

		return request;
	}
}
