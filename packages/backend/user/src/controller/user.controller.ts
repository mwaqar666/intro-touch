import { Auth, Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserService } from "@/backend/user/services";

@Controller
export class UserController {
	public constructor(
		// Dependencies
		@Inject(UserService) private readonly userService: UserService,
	) {}

	public async me(@Auth authEntity: UserEntity): Promise<{ user: UserEntity }> {
		return { user: await this.userService.getAuthUserWithLiveProfile(authEntity) };
	}
}
