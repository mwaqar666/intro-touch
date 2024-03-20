import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Transaction } from "sequelize";
import { UserContactEntity } from "@/backend/user/db/entities";

export class UserContactRepository extends BaseRepository<UserContactEntity> {
	public constructor() {
		super(UserContactEntity);
	}

	public async createUserContact(valuesToCreate: Partial<IEntityTableColumnProperties<UserContactEntity>>, transaction: Transaction): Promise<UserContactEntity> {
		return this.createOne({
			valuesToCreate,
			transaction,
		});
	}

	public getUserContacts(userContactUserId: number): Promise<Array<UserContactEntity>> {
		return this.findAll({
			findOptions: {
				where: { userContactUserId },
			},
			scopes: [EntityScopeConst.withoutTimestamps],
		});
	}
}
