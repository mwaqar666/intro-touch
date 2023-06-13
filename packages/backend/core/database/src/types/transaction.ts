import type { Delegate } from "@/stacks/types";
import type { Transaction } from "sequelize";

export interface ITransactionStore {
	transaction: Transaction;
}

export interface IRunningTransaction {
	currentTransaction: ITransactionStore;
	createdOnThisLevel: boolean;
}

export type TransactionCallback<T> = (runningTransaction: IRunningTransaction) => Promise<T>;

export type TransactionError = Delegate<[unknown], Promise<void>>;

export interface ITransactionalOperation<TransactionReturn> {
	withTransaction?: IRunningTransaction;
	transactionCallback: TransactionCallback<TransactionReturn>;
	failureCallback?: TransactionError;
}
