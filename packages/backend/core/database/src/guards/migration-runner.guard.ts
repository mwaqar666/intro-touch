import type { IGuard } from "@/backend-core/authentication/interface";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IDatabaseConfig } from "@/backend-core/config/types";
import { UnauthorizedException } from "@/backend-core/request-processor/exceptions";
import type { IControllerRequest } from "@/backend-core/request-processor/types";
import type { IPathParams, IQueryParams } from "@/backend-core/router/interface";
import type { Optional } from "@/stacks/types";
import { Inject } from "iocc";

export interface IMigrationTokenQueryParams extends IQueryParams {
	token: Optional<string>;
}

export type IMigrationRunnerRequest = IControllerRequest<object, IPathParams, IMigrationTokenQueryParams>;

export class MigrationRunnerGuard implements IGuard<IMigrationRunnerRequest> {
	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async guard(request: IMigrationRunnerRequest): Promise<void> {
		const migrationToken: Optional<string> = request.queryParams.token;

		if (!migrationToken) throw new UnauthorizedException("Invalid migration token");

		const databaseConfig: IDatabaseConfig = this.configResolver.resolveConfig("database");

		if (migrationToken !== databaseConfig.databaseMigrationPass) throw new UnauthorizedException("Invalid migration token");
	}
}
