import { UnauthorizedException } from "@/backend-core/request-processor/exceptions";
import type { Request } from "@/backend-core/request-processor/handlers";
import type { Nullable } from "@/stacks/types";
import type { IGuard } from "@/backend-core/authentication/interface";
import type { IAuthenticatableEntity } from "@/backend-core/authentication/types";

export class AuthRequestGuard implements IGuard {
	public async guard(request: Request): Promise<void> {
		const resolvedAuthEntity: Nullable<IAuthenticatableEntity> = await request.auth();

		if (resolvedAuthEntity) return;

		throw new UnauthorizedException();
	}
}
