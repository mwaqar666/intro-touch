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

export type IDbRequest = IControllerRequest<object, IPathParams, IMigrationTokenQueryParams>;

export class DbRunnerGuard implements IGuard<IDbRequest> {
	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async guard(request: IDbRequest): Promise<void> {
		const databaseToken: Optional<string> = request.queryParams.token;

		if (!databaseToken) throw new UnauthorizedException("Invalid database token");

		const databaseConfig: IDatabaseConfig = this.configResolver.resolveConfig("database");

		if (databaseToken !== databaseConfig.databaseToken) throw new UnauthorizedException("Invalid database token");
	}
}
