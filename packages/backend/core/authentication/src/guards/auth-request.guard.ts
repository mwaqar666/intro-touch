import type { UserEntity } from "@/backend/user/db/entities";
import { UserAuthService } from "@/backend/user/services";
import { UnauthorizedException } from "@/backend-core/request-processor/exceptions";
import type { IControllerAuthRequest } from "@/backend-core/request-processor/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { SessionValue } from "sst/node/auth";
import { useSession } from "sst/node/auth";
import type { IGuard } from "@/backend-core/authentication/interface";

export class AuthRequestGuard implements IGuard<IControllerAuthRequest> {
	public constructor(
		// Dependencies

		@Inject(UserAuthService) private readonly userAuthService: UserAuthService,
	) {}

	public async guard(request: IControllerAuthRequest): Promise<void> {
		const session: SessionValue = useSession();

		console.log(session);

		if (session.type !== "user") throw new UnauthorizedException();

		const user: Nullable<UserEntity> = await this.userAuthService.findActiveUserByUuid(session.properties.userUuid);

		if (!user) throw new UnauthorizedException();

		request.auth = user;
	}
}
