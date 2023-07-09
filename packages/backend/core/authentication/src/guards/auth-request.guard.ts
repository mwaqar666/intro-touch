import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import { UnauthorizedException } from "@/backend-core/request-processor/exceptions";
import type { IControllerAuthRequest } from "@/backend-core/request-processor/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { SessionValue } from "sst/node/auth";
import { useSession } from "sst/node/auth";
import type { IGuard } from "@/backend-core/authentication/interface";
import { VerificationTokenService } from "@/backend-core/authentication/services";

export class AuthRequestGuard implements IGuard<IControllerAuthRequest> {
	public constructor(
		// Dependencies

		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
		@Inject(VerificationTokenService) private readonly verificationTokenService: VerificationTokenService,
	) {}

	public async guard(request: IControllerAuthRequest): Promise<void> {
		const session: SessionValue = useSession();

		if (session.type !== "user") throw new UnauthorizedException();

		const user: Nullable<UserEntity> = await this.userAuthService.findActiveUserByUuid(session.properties.userUuid);

		if (!user) throw new UnauthorizedException();

		const userIsVerified: boolean = await this.verificationTokenService.verifyUserEmailIsVerified(user);

		if (!userIsVerified) throw new UnauthorizedException();

		request.auth = user;
	}
}
