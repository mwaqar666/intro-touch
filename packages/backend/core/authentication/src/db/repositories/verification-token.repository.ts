import { BaseRepository } from "@/backend-core/database/repository";
import { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";

export class VerificationTokenRepository extends BaseRepository<VerificationTokenEntity> {
	public constructor() {
		super(VerificationTokenEntity);
	}
}
