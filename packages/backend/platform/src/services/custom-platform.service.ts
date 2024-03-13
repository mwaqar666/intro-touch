import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { CustomPlatformEntity } from "@/backend/platform/db/entities";
import { CustomPlatformRepository } from "@/backend/platform/db/repositories";
import type { UpdateCustomPlatformRequestDto } from "@/backend/platform/dto/update-custom-platform";

export class CustomPlatformService {
	public constructor(
		// Dependencies

		@Inject(CustomPlatformRepository) private readonly customPlatformRepository: CustomPlatformRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public getCustomPlatformsByPlatformCategory(platformCategoryUuid: string): Promise<Array<CustomPlatformEntity>> {
		return this.customPlatformRepository.getCustomPlatformsByPlatformCategory(platformCategoryUuid);
	}

	public async updateCustomPlatform(customPlatformUuid: string, updateCustomPlatformRequestDto: UpdateCustomPlatformRequestDto): Promise<CustomPlatformEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<CustomPlatformEntity> => {
				return this.customPlatformRepository.updateCustomPlatform(customPlatformUuid, updateCustomPlatformRequestDto, transaction);
			},
		});
	}
}
