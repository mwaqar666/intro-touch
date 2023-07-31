import type { UserEntity } from "@/backend/user/db/entities";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import type { SignerOptions } from "fast-jwt";
import { Inject } from "iocc";
import ms from "ms";
import { Session } from "sst/node/auth";
import type { IAuthPayload } from "@/backend-core/authentication/types";

export class AuthTokenService {
	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public createAuthenticationToken(authEntity: UserEntity): string {
		return Session.create({
			type: "user",
			properties: this.createAuthPayload(authEntity),
			options: this.createTokenProps(authEntity),
		});
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
