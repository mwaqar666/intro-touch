import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { PlatformProfileEntity } from "@/backend/platform/db/entities";
import { PlatformProfileRepository } from "@/backend/platform/db/repositories";
import type { UpdateBuiltinPlatformRequestDto } from "@/backend/platform/dto/update-builtin-platform";

export class PlatformProfileService {
	public constructor(
		// Dependencies

		@Inject(PlatformProfileRepository) private readonly platformProfileRepository: PlatformProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async updateBuiltInPlatform(platformProfileUuid: string, updateBuiltinPlatformRequestDto: UpdateBuiltinPlatformRequestDto): Promise<PlatformProfileEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<PlatformProfileEntity> => {
				return this.platformProfileRepository.updateBuiltInPlatform(platformProfileUuid, updateBuiltinPlatformRequestDto, transaction);
			},
		});
	}
}
