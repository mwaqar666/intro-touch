import { EntityScopeConst } from "@/backend-core/database/const";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { SessionValue } from "sst/node/auth";
import { useSession } from "sst/node/auth";
import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import type { IAuthEntityResolver, IAuthProvider } from "@/backend-core/authentication/interface";
import type { IAuthenticatableEntity } from "@/backend-core/authentication/types";

export class AuthEntityResolver implements IAuthEntityResolver {
	private authEntity: Nullable<IAuthenticatableEntity> = null;

	public constructor(
		// Dependencies

		@Inject(AuthenticationTokenConst.AuthProviderToken) private readonly authProvider: IAuthProvider,
	) {}

	public async resolve(): Promise<Nullable<IAuthenticatableEntity>> {
		if (this.authEntity) return this.authEntity;

		const session: SessionValue = useSession();
		if (session.type !== "user") return null;

		const authEntity: Nullable<IAuthenticatableEntity> = await this.authProvider.retrieveByUuid(session.properties.userUuid, [EntityScopeConst.isActive]);
		if (!authEntity) return null;

		this.authEntity = authEntity;
		return this.authEntity;
	}
}
