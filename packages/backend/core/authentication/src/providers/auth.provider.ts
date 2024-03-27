import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import { App } from "@/backend-core/core/extensions";
import type { IEntityScope } from "@/backend-core/database/types";
import { InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { WhereOptions } from "sequelize";
import type { AuthDriver } from "@/backend-core/authentication/enums";
import type { IAuthProvider } from "@/backend-core/authentication/interface";
import type { IAuthenticatableEntity, IAuthenticatableRepository } from "@/backend-core/authentication/types";

export class AuthProvider implements IAuthProvider {
	private authRepository: Nullable<IAuthenticatableRepository> = null;

	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async useAuthDriver(driver: AuthDriver): Promise<IAuthProvider> {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		this.authRepository = App.container.resolve(await authConfig.authDrivers[driver].repository);

		return this;
	}

	public retrieveByPrimaryKey(primaryKey: number, scopes?: IEntityScope): Promise<Nullable<IAuthenticatableEntity>> {
		if (!this.authRepository) throw new InternalServerException("Authentication repository not configured");

		return this.authRepository.resolveOne(primaryKey, scopes);
	}

	public retrieveByUuid(uuid: string, scopes?: IEntityScope): Promise<Nullable<IAuthenticatableEntity>> {
		if (!this.authRepository) throw new InternalServerException("Authentication repository not configured");

		return this.authRepository.resolveOne(uuid, scopes);
	}

	public retrieveByCredentials<TCredentials extends WhereOptions<IAuthenticatableEntity>>(credentials: TCredentials, scopes?: IEntityScope): Promise<IAuthenticatableEntity> {
		if (!this.authRepository) throw new InternalServerException("Authentication repository not configured");

		return this.authRepository.findOneOrFail({
			findOptions: {
				where: credentials,
			},
			scopes,
		});
	}
}
