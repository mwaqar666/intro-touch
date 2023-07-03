import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import type { ApiResponse, Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { IdTokenClaims, TokenSet } from "openid-client";
import { GoogleAdapter, Session } from "sst/node/auth";
import type { IAuthAdapter } from "@/backend-core/authentication/interface";
import type { IAuthAdapterRecord, IGoogleAdapter } from "@/backend-core/authentication/types";

export class GoogleAuthAdapter implements IAuthAdapter<IGoogleAdapter> {
	public constructor(
		// Dependencies
		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public configureAuthAdapter(): IAuthAdapterRecord<IGoogleAdapter> {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		const googleAdapter = GoogleAdapter({
			mode: "oidc",
			clientID: authConfig.googleClientId,
			onSuccess: async (tokenSet: TokenSet): Promise<ApiResponse> => {
				const [userEntity, redirectUrl]: [UserEntity, string] = await this.lookUpUser(tokenSet);

				return Session.parameter({
					redirect: redirectUrl.toString(),
					type: "user",
					properties: {
						userUuid: userEntity.userUuid,
						userFirstName: userEntity.userFirstName,
						userLastName: userEntity.userLastName,
						userEmail: userEntity.userEmail,
					},
				});
			},
		});

		return {
			identifier: "google",
			adapter: googleAdapter,
		};
	}

	private async lookUpUser(tokenSet: TokenSet): Promise<[UserEntity, string]> {
		const claims: IdTokenClaims = tokenSet.claims();
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		let created = "true";
		let entity: Nullable<UserEntity>;

		entity = await this.userAuthService.findActiveUserByEmail(claims.email as string);

		if (entity) created = "false";
		else {
			entity = await this.userAuthService.createNewUserWithProfile({
				userEmail: claims.email as string,
				userFirstName: claims.given_name ?? "",
				userLastName: claims.family_name ?? "",
				userPassword: null,
				userPicture: claims.picture ?? "",
			});
		}

		const redirectUrl: URL = new URL(authConfig.googleRedirectUrl);
		redirectUrl.searchParams.set("created", created);

		return [entity, redirectUrl.toString()];
	}
}
