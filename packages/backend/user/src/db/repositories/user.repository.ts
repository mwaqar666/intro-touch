import { EntityScopeConst } from "@/backend-core/database/const";
import { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import type { Transaction } from "sequelize";
import { UserEntity } from "@/backend/user/db/entities";

export class UserRepository extends BaseRepository<UserEntity> {
	public constructor() {
		super(UserEntity);
	}

	public async getUserList(): Promise<Array<UserEntity>> {
		return this.findAll({
			findOptions: {},
			scopes: [EntityScopeConst.isActive],
		});
	}

	public async findOrFailActiveUserByUsername(userUsername: string): Promise<UserEntity> {
		return this.findOneOrFail({
			findOptions: {
				where: { userUsername },
			},
			scopes: [EntityScopeConst.isActive],
		});
	}

	public async findActiveUserByEmail(userEmail: string): Promise<Nullable<UserEntity>> {
		return this.findOne({
			findOptions: {
				where: { userEmail },
			},
			scopes: [EntityScopeConst.isActive],
		});
	}

	public async findActiveUserByUuid(userUuid: string): Promise<Nullable<UserEntity>> {
		return this.resolveOne(userUuid, [EntityScopeConst.isActive]);
	}

	public resetPassword(userEntity: UserEntity, valuesToUpdate: Partial<IEntityTableColumnProperties<UserEntity>>, transaction: Transaction): Promise<UserEntity> {
		return this.updateOne({
			findOptions: {
				where: { userId: userEntity.userId },
			},
			valuesToUpdate,
			transaction,
		});
	}
}
