import { Exception, InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import type { Transaction } from "sequelize";
import type { Sequelize } from "sequelize-typescript";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IDbConnector } from "@/backend-core/database/interface";
import type { ITransactionManager } from "@/backend-core/database/interface/transaction-manager";
import type { IRunningTransaction, ITransactionalOperation } from "@/backend-core/database/types";

export class TransactionManagerService implements ITransactionManager {
	private existingTransaction: Nullable<Transaction> = null;

	public constructor(
		// Dependencies
		@Inject(DbTokenConst.DbConnectorToken) private readonly dbConnector: IDbConnector<Sequelize>,
	) {}

	public async executeTransaction<T>(transactionalOperation: ITransactionalOperation<T>): Promise<T> {
		const preparedTransaction: IRunningTransaction = await this.prepareTransaction();

		try {
			const transactionResult: T = await transactionalOperation.operation(preparedTransaction.currentTransaction);

			await this.wrapUpTransaction(preparedTransaction);

			return transactionResult;
		} catch (exception: unknown) {
			await this.rollbackTransaction(preparedTransaction);

			if (transactionalOperation.failure) await transactionalOperation.failure(exception);

			throw this.createInternalServerError(exception);
		}
	}

	private async prepareTransaction(): Promise<IRunningTransaction> {
		if (this.existingTransaction) {
			return {
				currentTransaction: { transaction: this.existingTransaction },
				createdOnThisLevel: false,
			};
		}

		this.existingTransaction = await this.createTransaction();

		return {
			currentTransaction: { transaction: this.existingTransaction },
			createdOnThisLevel: true,
		};
	}

	private async wrapUpTransaction(preparedTransaction: IRunningTransaction): Promise<void> {
		if (!preparedTransaction.createdOnThisLevel) return;

		await preparedTransaction.currentTransaction.transaction.commit();

		this.existingTransaction = null;
	}

	private async rollbackTransaction(preparedTransaction: IRunningTransaction): Promise<void> {
		if (!this.existingTransaction) return;

		await preparedTransaction.currentTransaction.transaction.rollback();

		this.existingTransaction = null;
	}

	private createInternalServerError(exception: unknown): InternalServerException {
		if (exception instanceof Exception) return exception;

		return new InternalServerException((<Error>exception).message);
	}

	private async createTransaction(): Promise<Transaction> {
		const sequelize: Sequelize = this.dbConnector.getDatabaseConnection();

		return sequelize.transaction();
	}
}
