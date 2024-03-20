import { UserProfileService } from "@/backend/user/services";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import { Inject } from "iocc";
import type { PlatformProfileEntity } from "@/backend/platform/db/entities";
import { PlatformProfileRepository } from "@/backend/platform/db/repositories";
import type { CreateBuiltinPlatformRequestDto, UpdateBuiltinPlatformRequestDto } from "@/backend/platform/dto/update-builtin-platform";
import { PlatformService } from "@/backend/platform/services/platform.service";

export class PlatformProfileService {
	public constructor(
		// Dependencies

		@Inject(PlatformProfileRepository) private readonly platformProfileRepository: PlatformProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
		@Inject(PlatformService) private readonly platformService: PlatformService,
		@Inject(UserProfileService) private readonly userProfileService: UserProfileService,
	) {}

	public async updateBuiltInPlatform(platformProfileUuid: string, updateBuiltinPlatformRequestDto: UpdateBuiltinPlatformRequestDto): Promise<PlatformProfileEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<PlatformProfileEntity> => {
				return this.platformProfileRepository.updateBuiltInPlatform(platformProfileUuid, updateBuiltinPlatformRequestDto, transaction);
			},
		});
	}

	public async createBuiltInPlatform(userProfileUuid: string, platformUuid: string, createBuiltinPlatformRequestDto: CreateBuiltinPlatformRequestDto): Promise<PlatformProfileEntity> {
		const userProfileId: number = (await this.userProfileService.getUserProfile(userProfileUuid)).userProfileId;

		const platformId: number = (await this.platformService.fetchPlatform(platformUuid)).platformId;
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<PlatformProfileEntity> => {
				return await this.platformProfileRepository.createBuiltInPlatform(userProfileId, platformId, createBuiltinPlatformRequestDto, transaction);
			},
		});
	}

	public async deleteBuiltInPlatform(platformProfileUuid: string): Promise<boolean> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<boolean> => {
				return this.platformProfileRepository.deleteBuiltInPlatform(platformProfileUuid, transaction);
			},
		});
	}
}