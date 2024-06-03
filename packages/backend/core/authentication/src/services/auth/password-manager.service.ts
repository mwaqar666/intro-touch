import type { UserEntity } from "@/backend/user/db/entities";
import { UserRepository } from "@/backend/user/db/repositories";
import { DbTokenConst, EntityScopeConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import { BadRequestException, NotFoundException } from "@/backend-core/request-processor/exceptions";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import { AuthenticationTokenConst } from "@/backend-core/authentication/const";
import type { VerificationTokenEntity } from "@/backend-core/authentication/db/entities";
import { TokenType } from "@/backend-core/authentication/enums";
import type { IAuthenticatable, IAuthProvider, IChangePassword, IPasswordManager, IResetPassword, ISaveNewPassword, ISendPasswordResetToken } from "@/backend-core/authentication/interface";
import { HashService } from "@/backend-core/authentication/services/crypt";
import { AuthEmailService } from "@/backend-core/authentication/services/utils";
import { VerificationService } from "@/backend-core/authentication/services/verification";

export class PasswordManagerService implements IPasswordManager {
	public constructor(
		// Dependencies

		@Inject(HashService) private readonly hashService: HashService,
		@Inject(AuthEmailService) private readonly emailUtilService: AuthEmailService,
		@Inject(VerificationService) private readonly verificationService: VerificationService,
		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
		@Inject(AuthenticationTokenConst.AuthProviderToken) private readonly authProvider: IAuthProvider,
	) {}

	public async sendPasswordResetToken(sendPasswordResetToken: ISendPasswordResetToken): Promise<boolean> {
		const user: Nullable<UserEntity> = await this.authProvider.retrieveByCredentials<UserEntity>({ userEmail: sendPasswordResetToken.userEmail }, { scopes: [EntityScopeConst.isActive] });

		if (!user) throw new NotFoundException("Email not found");

		const verificationTokenEntity: VerificationTokenEntity = await this.verificationService.createVerificationToken(user, TokenType.ResetPassword);

		return this.emailUtilService.sendPasswordResetEmailToUser(user, verificationTokenEntity);
	}

	public async resetPassword(resetPassword: IResetPassword): Promise<IAuthenticatable> {
		const user: Nullable<UserEntity> = await this.authProvider.retrieveByCredentials<UserEntity>({ userEmail: resetPassword.userEmail }, { scopes: [EntityScopeConst.isActive] });

		if (!user) throw new NotFoundException("Email not found");

		await this.verificationService.validateVerificationToken(user, resetPassword.tokenIdentifier, TokenType.ResetPassword);

		return this.saveNewPassword(user, resetPassword);
	}

	public async changePassword(authenticatable: IAuthenticatable, changePassword: IChangePassword): Promise<IAuthenticatable> {
		const existingPassword: Nullable<string> = authenticatable.getAuthPassword();

		if (!existingPassword) throw new BadRequestException("Social login must set password first");

		const oldPasswordVerified: boolean = await this.hashService.compare(changePassword.userOldPassword, existingPassword);

		if (!oldPasswordVerified) throw new BadRequestException("Invalid old password");

		return this.saveNewPassword(authenticatable, changePassword);
	}

	public saveNewPassword(authenticatable: IAuthenticatable, saveNewPassword: ISaveNewPassword): Promise<IAuthenticatable> {
		return this.transactionManager.executeTransaction({
			operation: ({ transaction }: ITransactionStore): Promise<IAuthenticatable> => {
				if (saveNewPassword.userNewPassword !== saveNewPassword.userConfirmNewPassword) throw new BadRequestException("New password and confirm new password must be same");

				const updateUserFields: Partial<IEntityTableColumnProperties<UserEntity>> = {
					userPassword: saveNewPassword.userNewPassword,
				};

				return this.userRepository.updateUser(authenticatable.getAuthUuidIdentifier(), updateUserFields, transaction);
			},
		});
	}
}
