import type { UserEntity } from "@/backend/user/db/entities";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfig, IAppConfigResolver } from "@/backend-core/config/types";
import { Inject } from "iocc";
import type { JWTPayload } from "jose";
import { SignJWT } from "jose";
import type { IUserPayload } from "@/backend-core/authentication/types";

export class AuthTokenService {
	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async createAuthenticationToken(user: UserEntity): Promise<string> {
		const userPayload: IUserPayload = {
			userEmail: user.userEmail,
			userUuid: user.userUuid,
			userFirstName: user.userFirstName,
			userLastName: user.userLastName,
		};

		return await new SignJWT(<JWTPayload>(<unknown>userPayload)).setIssuedAt().setExpirationTime("2h").sign(this.getEncodedSecretKey());
	}

	private getEncodedSecretKey(): Uint8Array {
		const appConfig: IAppConfig = this.configResolver.resolveConfig("app");

		return new TextEncoder().encode(appConfig.key);
	}
}
