import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import type { IFindOrCreateUserProps } from "@/backend/user/types";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import type { Nullable } from "@/stacks/types";
import type { SignerOptions } from "fast-jwt";
import { Inject } from "iocc";
import ms from "ms";
import type { IAuthPayload } from "@/backend-core/authentication/types";

export class AdapterService {
	public constructor(
		// Dependencies
		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async findOrCreateUserInDatabase(findOrCreateUserProps: IFindOrCreateUserProps): Promise<[UserEntity, boolean]> {
		let created = true;

		let entity: Nullable<UserEntity> = await this.findUserInDatabaseByEmail(findOrCreateUserProps.userEmail);

		if (entity) created = false;
		else {
			entity = await this.createUserInDatabase(findOrCreateUserProps);
		}

		return [entity, created];
	}

	public async findUserInDatabaseByEmail(userEmail: string): Promise<Nullable<UserEntity>> {
		return this.userAuthService.findActiveUserByEmail(userEmail);
	}

	public async createUserInDatabase(createUserProps: IFindOrCreateUserProps): Promise<UserEntity> {
		return this.userAuthService.createNewUserWithProfile(createUserProps);
	}

	public prepareAuthRedirectionUrl(created: boolean): URL {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		const redirectUrl: URL = new URL(authConfig.redirectUrl);
		redirectUrl.searchParams.set("created", created.toString());

		return redirectUrl;
	}

	public createAuthPayload(authEntity: UserEntity): IAuthPayload {
		return {
			userUuid: authEntity.userUuid,
			userFirstName: authEntity.userFirstName,
			userLastName: authEntity.userLastName,
			userEmail: authEntity.userEmail,
		};
	}

	public createTokenProps(authEntity: UserEntity): SignerOptions {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		return {
			sub: authEntity.userUuid,
			expiresIn: ms(authConfig.tokenExpiry),
		};
	}
}
