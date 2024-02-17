import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { SessionValue } from "sst/node/auth";
import { useSession } from "sst/node/auth";
import { VerificationTokenService } from "@/backend-core/authentication/dal";
import type { IAuthEntityResolver } from "@/backend-core/authentication/interface";

export class AuthEntityResolver implements IAuthEntityResolver {
	private _resolvedAuthEntity: Nullable<UserEntity> = null;

	public constructor(
		// Dependencies

		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		@Inject(VerificationTokenService) private readonly verificationTokenService: VerificationTokenService,
	) {}

	public async resolve(): Promise<Nullable<UserEntity>> {
		if (this._resolvedAuthEntity) return this._resolvedAuthEntity;

		const session: SessionValue = useSession();

		if (session.type !== "user") return null;

		const user: Nullable<UserEntity> = await this.userAuthService.findActiveUserByUuid(session.properties.userUuid);

		if (!user) return null;

		const userIsVerified: boolean = await this.verificationTokenService.verifyUserEmailIsVerified(user);

		if (!userIsVerified) return null;

		this._resolvedAuthEntity = user;

		return this._resolvedAuthEntity;
	}
}
