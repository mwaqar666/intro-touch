import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import type { IFindOrCreateUserProps } from "@/backend/user/types";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IAuthConfig } from "@/backend-core/config/types";
import { App } from "@/backend-core/core/extensions";
import { HttpStatusCode } from "@/backend-core/request-processor/enums";
import { Response } from "@/backend-core/request-processor/handlers";
import type { Nullable } from "@/stacks/types";
import type { SignerOptions } from "fast-jwt";
import { Inject } from "iocc";
import ms from "ms";
import { Session } from "sst/node/auth";
import type { IAuthPayload } from "@/backend-core/authentication/types";

export class SocialAuthService {
	public constructor(
		// Dependencies

		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {}

	public async socialAuth(findOrCreateUserProps: Omit<IFindOrCreateUserProps, "userPassword">): Promise<Response> {
		let created = true;

		let entity: Nullable<UserEntity> = await this.userAuthService.findActiveUserByEmail(findOrCreateUserProps.userEmail);

		if (entity) created = false;
		else entity = await this.userAuthService.createNewUserWithProfile({ ...findOrCreateUserProps, userPassword: null });

		return this.prepareRedirectionResponse(entity, created);
	}

	private prepareRedirectionResponse(authEntity: UserEntity, created: boolean): Response {
		const token: string = this.createAuthenticationToken(authEntity);

		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		const redirectUrl: URL = new URL(authConfig.redirectUrl);
		redirectUrl.searchParams.set("token", token);
		redirectUrl.searchParams.set("created", created.toString());

		return App.container.resolve(Response).setStatusCode(HttpStatusCode.Found).setHeaders({
			location: redirectUrl.toString(),
		});
	}

	private createAuthenticationToken(authEntity: UserEntity): string {
		return Session.create({
			type: "user",
			properties: this.createAuthPayload(authEntity),
			options: this.createTokenProps(authEntity),
		});
	}

	private createAuthPayload(authEntity: UserEntity): IAuthPayload {
		return {
			userUuid: authEntity.userUuid,
			userFirstName: authEntity.userFirstName,
			userLastName: authEntity.userLastName,
			userEmail: authEntity.userEmail,
		};
	}

	private createTokenProps(authEntity: UserEntity): SignerOptions {
		const authConfig: IAuthConfig = this.configResolver.resolveConfig("auth");

		return {
			sub: authEntity.userUuid,
			expiresIn: ms(authConfig.tokenExpiry),
		};
	}
}
