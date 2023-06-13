import { Exception, InternalServerException } from "@/backend-core/request-processor/exceptions";
import { Inject } from "iocc";
import type { Transaction } from "sequelize";
import type { Sequelize } from "sequelize-typescript";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IDbConnector } from "@/backend-core/database/interface";
import type { ITransactionManager } from "@/backend-core/database/interface/transaction-manager";
import type { IRunningTransaction, ITransactionalOperation, ITransactionStore } from "@/backend-core/database/types";

export class TransactionManagerService implements ITransactionManager {
	public constructor(
		// Dependencies
		@Inject(DbTokenConst.DbConnectorToken) private readonly dbConnector: IDbConnector<Sequelize>,
	) {}

	public async executeTransactionalOperation<T>(transactionalOperation: ITransactionalOperation<T>): Promise<T> {
		const preparedTransaction: IRunningTransaction = await this.prepareTransaction(transactionalOperation.withTransaction);

		try {
			const transactionResult: T = await transactionalOperation.transactionCallback(preparedTransaction);

			await this.wrapUpTransaction(preparedTransaction);

			return transactionResult;
		} catch (exception: unknown) {
			await this.rollbackTransaction(preparedTransaction);

			if (transactionalOperation.failureCallback) await transactionalOperation.failureCallback(exception);

			throw this.createInternalServerError(exception);
		}
	}

	private async prepareTransaction(preparedTransaction?: IRunningTransaction): Promise<IRunningTransaction> {
		if (preparedTransaction)
			return {
				currentTransaction: preparedTransaction.currentTransaction,
				createdOnThisLevel: false,
			};

		return {
			currentTransaction: await this.createNewTransaction(),
			createdOnThisLevel: true,
		};
	}

	private async wrapUpTransaction(preparedTransaction: IRunningTransaction): Promise<void> {
		if (!preparedTransaction.createdOnThisLevel) return;

		await preparedTransaction.currentTransaction.transaction.commit();
	}

	private async rollbackTransaction(preparedTransaction: IRunningTransaction): Promise<void> {
		try {
			await preparedTransaction.currentTransaction.transaction.rollback();
		} catch (exception) {
			// Transaction has been rolled back already
		}
	}

	private createInternalServerError(exception: unknown): InternalServerException {
		if (exception instanceof Exception) return exception;

		return new InternalServerException((<Error>exception).message);
	}

	private async createNewTransaction(): Promise<ITransactionStore> {
		return { transaction: await this.createTransaction() };
	}

	private async createTransaction(): Promise<Transaction> {
		const sequelize: Sequelize = this.dbConnector.getDatabaseConnection();

		return sequelize.transaction();
	}
}
