import type { IGuard } from "@/backend-core/authentication/interface";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IDatabaseConfig } from "@/backend-core/config/types";
import { UnauthorizedException } from "@/backend-core/request-processor/exceptions";
import type { Request } from "@/backend-core/request-processor/handlers";
import type { Optional } from "@/stacks/types";
import { Inject } from "iocc";

export class DbRunnerGuard implements IGuard {
	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async guard(request: Request): Promise<void> {
		const databaseToken: Optional<string> = request.getHeaders("X-DB-TOKEN");

		if (!databaseToken) throw new UnauthorizedException("Missing database token");

		const databaseConfig: IDatabaseConfig = this.configResolver.resolveConfig("database");

		if (databaseToken !== databaseConfig.databaseToken) throw new UnauthorizedException("Invalid database token");
	}
}
