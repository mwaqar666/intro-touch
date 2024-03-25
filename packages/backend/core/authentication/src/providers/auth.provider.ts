import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import { App } from "@/backend-core/core/extensions";
import { InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { WhereOptions } from "sequelize";
import type { AuthDriver } from "@/backend-core/authentication/enums";
import type { IAuthProvider } from "@/backend-core/authentication/interface";
import type { IAuthEntity, IAuthRepository } from "@/backend-core/authentication/types";

export class AuthProvider implements IAuthProvider {
	private authRepository: Nullable<IAuthRepository> = null;

	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async useAuthDriver(driver: AuthDriver): Promise<IAuthProvider> {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		this.authRepository = App.container.resolve(await authConfig.authDrivers[driver].repository);

		return this;
	}

	public retrieveByPrimaryKey(primaryKey: number): Promise<IAuthEntity> {
		if (!this.authRepository) throw new InternalServerException("Authentication repository not configured");

		return this.authRepository.resolveOneOrFail(primaryKey);
	}

	public retrieveByCredentials<TCredentials extends WhereOptions<IAuthEntity>>(credentials: TCredentials): Promise<IAuthEntity> {
		if (!this.authRepository) throw new InternalServerException("Authentication repository not configured");

		return this.authRepository.findOneOrFail({
			findOptions: {
				where: credentials,
			},
		});
	}
}
