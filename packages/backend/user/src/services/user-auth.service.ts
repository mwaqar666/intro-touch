import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import { InvalidCredentialsException } from "@/backend-core/authentication/exceptions";
import type { IAuthProvider } from "@/backend-core/authentication/interface";
import type { IAuthenticatableEntity } from "@/backend-core/authentication/types";
import type { RoleEntity } from "@/backend-core/authorization/db/entities";
import { RoleRepository, UserRoleRepository } from "@/backend-core/authorization/db/repositories";
import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ITransactionStore } from "@/backend-core/database/types";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { UserEntity } from "@/backend/user/db/entities";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";
import type { IFindOrCreateUserProps, IUserAuthenticationProps, IUserCredentialProps, IUserRetrievalProps } from "@/backend/user/types";

export class UserAuthService {
	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(RoleRepository) private readonly roleRepository: RoleRepository,
		@Inject(UserRoleRepository) private readonly userRoleRepository: UserRoleRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(AuthenticationTokenConst.AuthProviderToken) private readonly authProvider: IAuthProvider,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async validateUserWithCredentials({ userEmail, userPassword }: IUserAuthenticationProps): Promise<UserEntity> {
		const authEntity: UserEntity = await this.retrieveUserByCredentials({ userEmail }, true);

		return this.validateUserByCredentials(authEntity, { userPassword });
	}

	public async retrieveUserByCredentials({ userEmail }: IUserRetrievalProps): Promise<Nullable<UserEntity>>;
	public async retrieveUserByCredentials({ userEmail }: IUserRetrievalProps, throwError: true): Promise<UserEntity>;
	public async retrieveUserByCredentials({ userEmail }: IUserRetrievalProps, throwError: boolean = false): Promise<Nullable<UserEntity>> {
		const authEntity: Nullable<IAuthenticatableEntity> = await this.authProvider.retrieveByCredentials({ userEmail }, [EntityScopeConst.isActive]);
		if (!authEntity && throwError) throw new InvalidCredentialsException();

		return authEntity as Nullable<UserEntity>;
	}

	public async validateUserByCredentials(authEntity: IAuthenticatableEntity, { userPassword }: IUserCredentialProps): Promise<UserEntity> {
		const passwordVerified: boolean = await authEntity.verifyPassword(userPassword);
		if (!passwordVerified) throw new InvalidCredentialsException();

		return authEntity as UserEntity;
	}

	public createNewUserWithProfile(userProperties: IFindOrCreateUserProps): Promise<UserEntity> {
		return this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<UserEntity> => {
				const user: UserEntity = await this.userRepository.createOne({
					valuesToCreate: userProperties,
					transaction,
				});

				await this.userProfileRepository.createOne({
					valuesToCreate: {
						userProfileUserId: user.userId,
						userProfileEmail: userProperties.userEmail,
						userProfilePicture: userProperties.userPicture,
						userProfileFirstName: userProperties.userFirstName,
						userProfileLastName: userProperties.userLastName,
						userProfileIsLive: true,
					},
					transaction,
				});

				const admin: RoleEntity = await this.roleRepository.getAdminRole();

				await this.userRoleRepository.attachRoleToUser(user, admin, transaction);

				return user;
			},
		});
	}
}
