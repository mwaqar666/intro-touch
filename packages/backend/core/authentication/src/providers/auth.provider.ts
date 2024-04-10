import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import { App } from "@/backend-core/core/extensions";
import { InternalServerException, NotFoundException } from "@/backend-core/request-processor/exceptions";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { WhereOptions } from "sequelize";
import type { AuthDriver } from "@/backend-core/authentication/enums";
import type { IAuthProvider } from "@/backend-core/authentication/interface";
import type { IAuthenticatableEntity, IAuthenticatableRepository, IAuthEntityOptions, INonNullableAuthEntityOptions, INullableAuthEntityOptions } from "@/backend-core/authentication/types";

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

	public retrieveByPrimaryKey<TAuthEntity extends IAuthenticatableEntity>(primaryKey: number, options?: INullableAuthEntityOptions): Promise<Nullable<TAuthEntity>>;
	public retrieveByPrimaryKey<TAuthEntity extends IAuthenticatableEntity>(primaryKey: number, options: INonNullableAuthEntityOptions): Promise<TAuthEntity>;
	public async retrieveByPrimaryKey<TAuthEntity extends IAuthenticatableEntity>(primaryKey: number, options?: IAuthEntityOptions): Promise<Nullable<TAuthEntity>> {
		if (!this.authRepository) throw new InternalServerException("Authentication repository not configured");

		const resolvedOptions: Required<IAuthEntityOptions> = this.createAuthEntityResolverOptions(options);

		const authEntity: Nullable<IAuthenticatableEntity> = await this.authRepository.resolveOne(primaryKey, resolvedOptions.scopes);

		return this.throwOrReturnAuthEntity<TAuthEntity>(authEntity, resolvedOptions.throwOnAbsence);
	}

	public retrieveByUuid<TAuthEntity extends IAuthenticatableEntity>(uuid: string, options?: INullableAuthEntityOptions): Promise<Nullable<TAuthEntity>>;
	public retrieveByUuid<TAuthEntity extends IAuthenticatableEntity>(uuid: string, options: INonNullableAuthEntityOptions): Promise<TAuthEntity>;
	public async retrieveByUuid<TAuthEntity extends IAuthenticatableEntity>(uuid: string, options?: IAuthEntityOptions): Promise<Nullable<TAuthEntity>> {
		if (!this.authRepository) throw new InternalServerException("Authentication repository not configured");

		const resolvedOptions: Required<IAuthEntityOptions> = this.createAuthEntityResolverOptions(options);

		const authEntity: Nullable<IAuthenticatableEntity> = await this.authRepository.resolveOne(uuid, resolvedOptions.scopes);

		return this.throwOrReturnAuthEntity<TAuthEntity>(authEntity, resolvedOptions.throwOnAbsence);
	}

	public retrieveByCredentials<TAuthEntity extends IAuthenticatableEntity>(credentials: WhereOptions<TAuthEntity>, options?: INullableAuthEntityOptions): Promise<Nullable<TAuthEntity>>;
	public retrieveByCredentials<TAuthEntity extends IAuthenticatableEntity>(credentials: WhereOptions<TAuthEntity>, options: INonNullableAuthEntityOptions): Promise<TAuthEntity>;
	public async retrieveByCredentials<TAuthEntity extends IAuthenticatableEntity>(credentials: WhereOptions<TAuthEntity>, options?: IAuthEntityOptions): Promise<Nullable<TAuthEntity>> {
		if (!this.authRepository) throw new InternalServerException("Authentication repository not configured");

		const resolvedOptions: Required<IAuthEntityOptions> = this.createAuthEntityResolverOptions(options);

		const authEntity: Nullable<IAuthenticatableEntity> = await this.authRepository.findOne({
			findOptions: { where: credentials },
			scopes: resolvedOptions.scopes,
		});

		return this.throwOrReturnAuthEntity<TAuthEntity>(authEntity, resolvedOptions.throwOnAbsence);
	}

	private createAuthEntityResolverOptions(options?: IAuthEntityOptions): Required<IAuthEntityOptions> {
		return {
			scopes: options && options.scopes ? options.scopes : [],
			throwOnAbsence: options && options.throwOnAbsence ? options.throwOnAbsence : false,
		};
	}

	private throwOrReturnAuthEntity<TAuthEntity extends IAuthenticatableEntity>(authEntity: Nullable<IAuthenticatableEntity>, throwOnAbsence: boolean): Nullable<TAuthEntity> {
		if (throwOnAbsence && !authEntity) throw new NotFoundException("Invalid auth entity");

		return authEntity as Nullable<TAuthEntity>;
	}
}
