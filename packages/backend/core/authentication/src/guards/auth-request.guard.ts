import type { UserEntity } from "@/backend/user/db/entities";
import { UnauthorizedException } from "@/backend-core/request-processor/exceptions";
import type { Request } from "@/backend-core/request-processor/handlers";
import type { Nullable } from "@/stacks/types";
import type { IGuard } from "@/backend-core/authentication/interface";

export class AuthRequestGuard implements IGuard {
	public async guard(request: Request): Promise<void> {
		const resolvedAuthEntity: Nullable<UserEntity> = await request.auth();

		if (resolvedAuthEntity) return;

		throw new UnauthorizedException();
	}
}
